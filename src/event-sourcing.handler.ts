import { Injectable, Inject } from '@nestjs/common';
import { EventStoreService } from './event-store.service';
import { BaseEvent } from './events/base.event';
import { IEventSourcingHandler } from './handlers/event-sourcing.handler';
import { ExtendedAggregateRoot } from './aggregator/extended.aggregator';
import { Type } from './helpers/utils.helper';

@Injectable()
export class EventSourcingHandler<T extends ExtendedAggregateRoot> implements IEventSourcingHandler<T> {
  constructor(
    @Inject(EventStoreService)
    private eventStoreService: EventStoreService<T>,
  ) {}

  public async save(aggregate: T): Promise<void> {
    await this.eventStoreService.saveEvents(aggregate);

    // aggregate.markChangesAsCommitted();
  }

  public async getById(aggregateClass: Type<T>, id: string): Promise<T> {
    const aggregate: T = new aggregateClass();
    const events: BaseEvent[] = await this.eventStoreService.getEvents(id);

    if (!events || !events.length) {
      return aggregate;
    }

    if (events && events.length) {
      aggregate.loadFromHistory(events);

      aggregate.version = this.getLatestVersion(events);
    }

    return aggregate;
  }

  private getLatestVersion(events: BaseEvent[]): number {
    return events.reduce((a, b) => (a.version > b.version ? a : b)).version;
  }
}
