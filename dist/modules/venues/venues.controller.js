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
exports.VenueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const venues_service_1 = require("./venues.service");
const venue_dto_1 = require("../../dto/venue.dto");
let VenueController = exports.VenueController = class VenueController {
    constructor(venueService) {
        this.venueService = venueService;
    }
    async postNewVenue(venueDto) {
        return await this.venueService.addNewVenue(venueDto);
    }
    async updateVenueData(venueDto, venueID) {
        return await this.venueService.updateVenue(venueID, venueDto);
    }
    async deleteVenueByID(venueID) {
        return await this.venueService.deleteVenue(venueID);
    }
    async fetchAllVenues(limit, offset, venueName) {
        return await this.venueService.getAllVenues(limit, offset, venueName);
    }
    async fetchVenueByID(sponsorID) {
        return await this.venueService.getVenueById(sponsorID);
    }
};
__decorate([
    (0, common_1.Post)('addVenue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [venue_dto_1.VenueDto]),
    __metadata("design:returntype", Promise)
], VenueController.prototype, "postNewVenue", null);
__decorate([
    (0, common_1.Put)('updateVenue/:venueID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('venueID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [venue_dto_1.VenueDto, String]),
    __metadata("design:returntype", Promise)
], VenueController.prototype, "updateVenueData", null);
__decorate([
    (0, common_1.Delete)('deleteVenue/:venueID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('venueID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VenueController.prototype, "deleteVenueByID", null);
__decorate([
    (0, common_1.Get)('getAllVenues'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'venueName', required: false, type: String }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('venueName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], VenueController.prototype, "fetchAllVenues", null);
__decorate([
    (0, common_1.Get)('getVenueByID/:venueID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('venueID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VenueController.prototype, "fetchVenueByID", null);
exports.VenueController = VenueController = __decorate([
    (0, swagger_1.ApiTags)('Venues'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('venues'),
    __metadata("design:paramtypes", [venues_service_1.VenueService])
], VenueController);
//# sourceMappingURL=venues.controller.js.map