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
exports.SpeakerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const speakers_service_1 = require("./speakers.service");
const speaker_dto_1 = require("../../dto/speaker.dto");
let SpeakerController = exports.SpeakerController = class SpeakerController {
    constructor(speakerService) {
        this.speakerService = speakerService;
    }
    async postNewSpeaker(speakerDto) {
        return await this.speakerService.addNewSpeaker(speakerDto);
    }
    async updateSpeakerData(speakerDto, speakerID) {
        return await this.speakerService.updateSpeaker(speakerID, speakerDto);
    }
    async deleteSpeakerByID(speakerID) {
        return await this.speakerService.deleteSpeaker(speakerID);
    }
    async fetchAllSpeakers(limit, offset, speakerName) {
        return await this.speakerService.getAllSpeakers(limit, offset, speakerName);
    }
    async fetchSpeakerByID(speakerID) {
        return await this.speakerService.getSpeakerById(speakerID);
    }
};
__decorate([
    (0, common_1.Post)('addSpeaker'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [speaker_dto_1.SpeakerDto]),
    __metadata("design:returntype", Promise)
], SpeakerController.prototype, "postNewSpeaker", null);
__decorate([
    (0, common_1.Put)('updateSpeaker/:speakerID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('speakerID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [speaker_dto_1.SpeakerDto, String]),
    __metadata("design:returntype", Promise)
], SpeakerController.prototype, "updateSpeakerData", null);
__decorate([
    (0, common_1.Delete)('deleteSpeaker/:speakerID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('speakerID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpeakerController.prototype, "deleteSpeakerByID", null);
__decorate([
    (0, common_1.Get)('getAllSpeakers'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'speakerName', required: false, type: String }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('speakerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], SpeakerController.prototype, "fetchAllSpeakers", null);
__decorate([
    (0, common_1.Get)('getSpeakerByID/:speakerID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('speakerID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpeakerController.prototype, "fetchSpeakerByID", null);
exports.SpeakerController = SpeakerController = __decorate([
    (0, swagger_1.ApiTags)('Speakers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('speakers'),
    __metadata("design:paramtypes", [speakers_service_1.SpeakerService])
], SpeakerController);
//# sourceMappingURL=speakers.controller.js.map