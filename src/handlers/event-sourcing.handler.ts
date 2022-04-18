import { Type } from '../helpers/utils.helper';
import { ExtendedAggregateRoot } from '../aggregator/extended.aggregator';

export interface IEventSourcingHandler<T extends ExtendedAggregateRoot> {
  save(aggregate: T): Promise<void>;
  getById(aggregate: Type<T>, id: string): Promise<T>;
}
