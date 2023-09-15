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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const events_service_1 = require("./events.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const event_dto_1 = require("../../dto/event.dto");
let EventsController = exports.EventsController = class EventsController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    async postNewEvent(eventDto) {
        return await this.eventService.createNewEvent(eventDto);
    }
    async updateEventData(eventDto, eventID) {
        return await this.eventService.updateEvent(eventDto, eventID);
    }
    async deleteEventByID(eventID) {
        return await this.eventService.deleteEvent(eventID);
    }
    async fetchAllEvents(limit, offset, userID, title, location, type, startDate, endDate, speaker) {
        return await this.eventService.getAllEvents(limit, offset, userID, title, location, type, startDate, endDate, speaker);
    }
    async fetchAllEventsByCategory(limit, offset) {
        return await this.eventService.getAllEventsByCategory(limit, offset);
    }
    async fetchUpcomingEvents(limit, offset, title) {
        return await this.eventService.getUpcomingEvents(limit, offset, title);
    }
    async fetchOnGoingEvents(limit, offset, title) {
        return await this.eventService.getOnGoingEvents(limit, offset, title);
    }
    async fetchFinishedEvents(limit, offset, title) {
        return await this.eventService.getFinishedEvents(limit, offset, title);
    }
    async fetchEventStats() {
        return await this.eventService.getEventStats();
    }
    async fetchEventsForCalendar(limit, offset) {
        return await this.eventService.getUpcomingEventsForCalendar(limit, offset);
    }
    async fetchEventByID(eventID) {
        return await this.eventService.getEventByID(eventID);
    }
};
__decorate([
    (0, common_1.Post)('createNewEvent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.EventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "postNewEvent", null);
__decorate([
    (0, common_1.Put)('updateEvent/:eventID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('eventID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.EventDto, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateEventData", null);
__decorate([
    (0, common_1.Delete)('deleteEvent/:eventID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('eventID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "deleteEventByID", null);
__decorate([
    (0, common_1.Get)('getAllEvents'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'userID', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'title', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'location', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'speaker', type: String, required: false }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('userID')),
    __param(3, (0, common_1.Query)('title')),
    __param(4, (0, common_1.Query)('location')),
    __param(5, (0, common_1.Query)('type')),
    __param(6, (0, common_1.Query)('startDate')),
    __param(7, (0, common_1.Query)('endDate')),
    __param(8, (0, common_1.Query)('speaker')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "fetchAllEvents", null);
__decorate([
    (0, common_1.Get)('getAllEventsByCategory'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: true, type: Number }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "fetchAllEventsByCategory", null);
__decorate([
    (0, common_1.Get)('getUpcomingEvents'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'title', type: String, required: false }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "fetchUpcomingEvents", null);
__decorate([
    (0, common_1.Get)('getOnGoingEvents'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'title', type: String, required: false }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "fetchOnGoingEvents", null);
__decorate([
    (0, common_1.Get)('getFinishedEvents'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'title', type: String, required: false }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "fetchFinishedEvents", null);
__decorate([
    (0, common_1.Get)('getEventStats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "fetchEventStats", null);
__decorate([
    (0, common_1.Get)('getEventsForCalendar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "fetchEventsForCalendar", null);
__decorate([
    (0, common_1.Get)('getEventByID/:eventID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('eventID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "fetchEventByID", null);
exports.EventsController = EventsController = __decorate([
    (0, swagger_1.ApiTags)('Events'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map