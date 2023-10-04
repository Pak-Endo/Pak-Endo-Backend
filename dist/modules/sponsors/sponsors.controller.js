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
exports.SponsorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const sponsors_service_1 = require("./sponsors.service");
const sponsor_dto_1 = require("../../dto/sponsor.dto");
let SponsorController = exports.SponsorController = class SponsorController {
    constructor(sponsorService) {
        this.sponsorService = sponsorService;
    }
    async postNewSponsor(sponsorDto) {
        return await this.sponsorService.addNewSponsor(sponsorDto);
    }
    async updateSponsorData(sponsorDto, sponsorID) {
        return await this.sponsorService.updateSponsor(sponsorID, sponsorDto);
    }
    async deleteSponsorByID(sponsorID) {
        return await this.sponsorService.deleteSponsor(sponsorID);
    }
    async fetchAllSponsors(limit, offset, sponsorName) {
        return await this.sponsorService.getAllSponsors(limit, offset, sponsorName);
    }
    async fetchSponsorByID(sponsorID) {
        return await this.sponsorService.getSponsorById(sponsorID);
    }
    async deleteAllSponsors() {
        return await this.sponsorService.deleteAllSponsors();
    }
};
__decorate([
    (0, common_1.Post)('addSponsor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sponsor_dto_1.SponsorDto]),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "postNewSponsor", null);
__decorate([
    (0, common_1.Put)('updateSponsor/:sponsorID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('sponsorID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sponsor_dto_1.SponsorDto, String]),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "updateSponsorData", null);
__decorate([
    (0, common_1.Delete)('deleteSponsor/:sponsorID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sponsorID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "deleteSponsorByID", null);
__decorate([
    (0, common_1.Get)('getAllSponsors'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sponsorName', required: false, type: String }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('sponsorName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "fetchAllSponsors", null);
__decorate([
    (0, common_1.Get)('getSponsorByID/:sponsorID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sponsorID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "fetchSponsorByID", null);
__decorate([
    (0, common_1.Delete)('deleteAllSponsors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "deleteAllSponsors", null);
exports.SponsorController = SponsorController = __decorate([
    (0, swagger_1.ApiTags)('Sponsors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('sponsors'),
    __metadata("design:paramtypes", [sponsors_service_1.SponsorService])
], SponsorController);
//# sourceMappingURL=sponsors.controller.js.map