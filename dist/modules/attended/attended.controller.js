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
exports.AttendedController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const attended_service_1 = require("./attended.service");
const attended_dto_1 = require("../../dto/attended.dto");
let AttendedController = exports.AttendedController = class AttendedController {
    constructor(attendService) {
        this.attendService = attendService;
    }
    async getAttended(limit = 10, offset = 0) {
        return await this.attendService.getAllAttended(offset, limit);
    }
    async getFavById(id, req) {
        return await this.attendService.getAttended(id, req);
    }
    async addToAttendedEvents(AttendedDto, req) {
        return await this.attendService.addToAttended(AttendedDto, req);
    }
};
__decorate([
    (0, common_1.Get)('getAllAttended'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AttendedController.prototype, "getAttended", null);
__decorate([
    (0, common_1.Get)('getAttendedEventByID/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttendedController.prototype, "getFavById", null);
__decorate([
    (0, common_1.Post)('addToAttendedEvents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attended_dto_1.AttendedDto, Object]),
    __metadata("design:returntype", Promise)
], AttendedController.prototype, "addToAttendedEvents", null);
exports.AttendedController = AttendedController = __decorate([
    (0, swagger_1.ApiTags)('Attended'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('attended'),
    __metadata("design:paramtypes", [attended_service_1.AttendedService])
], AttendedController);
//# sourceMappingURL=attended.controller.js.map