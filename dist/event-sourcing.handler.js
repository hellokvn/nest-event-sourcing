"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSourcingHandler = void 0;
const common_1 = require("@nestjs/common");
const event_store_service_1 = require("./event-store.service");
let EventSourcingHandler = class EventSourcingHandler {
    constructor(eventStoreService) {
        this.eventStoreService = eventStoreService;
    }
    async save(aggregate) {
        console.log('AccountEventSourcingHandler/save');
        await this.eventStoreService.saveEvents(aggregate.id, aggregate.getUncommittedEvents(), aggregate.version, aggregate.type);
    }
    async getById(aggregate, id) {
        console.log('AccountEventSourcingHandler/getById');
        const events = await this.eventStoreService.getEvents(id);
        if (events && events.length) {
            aggregate.loadFromHistory(events);
            aggregate.version = this.getLatestVersion(events);
        }
        return aggregate;
    }
    getLatestVersion(events) {
        return events.reduce((a, b) => (a.version > b.version ? a : b)).version;
    }
};
EventSourcingHandler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(event_store_service_1.EventStoreService)),
    __metadata("design:paramtypes", [event_store_service_1.EventStoreService])
], EventSourcingHandler);
exports.EventSourcingHandler = EventSourcingHandler;
//# sourceMappingURL=event-sourcing.handler.js.map