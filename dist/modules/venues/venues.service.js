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
exports.VenueService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/user.service");
let VenueService = exports.VenueService = class VenueService {
    constructor(venueModel) {
        this.venueModel = venueModel;
    }
    async getAllVenues(limit, offset, venueName) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        let filters = {}, sort = {};
        if (venueName && venueName.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, venueName: nameSort };
            const query = new RegExp(`${venueName}`, 'i');
            filters = { ...filters, venueName: query };
        }
        else {
            sort = { ...sort, createdAt: -1 };
        }
        const countPipeline = [
            {
                $match: {
                    deletedCheck: false,
                    ...filters
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ];
        const countResult = await this.venueModel.aggregate(countPipeline).exec();
        const totalCount = countResult.length > 0 ? countResult[0].count : 0;
        const venueList = await this.venueModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    ...filters
                }
            },
            {
                $sort: sort
            }
        ])
            .skip(Number(offset))
            .limit(Number(limit));
        return {
            totalCount,
            data: venueList
        };
    }
    async getVenueById(venueID) {
        const venueExists = await this.venueModel.findOne({ _id: venueID, deletedCheck: false });
        if (!venueExists) {
            throw new common_1.NotFoundException('Venue Does not exist');
        }
        const venue = await this.venueModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    _id: venueID
                }
            }
        ]);
        return venue;
    }
    async addNewVenue(venue) {
        const venueExists = await this.venueModel.findOne({ venueName: venue.venueName, city: venue.city, deletedCheck: false });
        if (venueExists) {
            throw new common_1.BadRequestException('Venue already exists');
        }
        venue._id = new mongoose_2.Types.ObjectId().toString();
        venue.deletedCheck = false;
        return await new this.venueModel(venue).save();
    }
    async updateVenue(venueID, venueData) {
        const venueExists = await this.venueModel.findOne({ _id: venueID, deletedCheck: false });
        if (!venueExists) {
            throw new common_1.NotFoundException('Venue not found');
        }
        venueData.deletedCheck = false;
        let updatedVenue = await this.venueModel.updateOne({ _id: venueID }, venueData);
        if (updatedVenue) {
            return { message: 'Venue updated successfully' };
        }
    }
    async deleteVenue(venueID) {
        const venueExists = await this.venueModel.findOne({ _id: venueID, deletedCheck: false });
        if (!venueExists) {
            throw new common_1.NotFoundException('Venue not found');
        }
        return await this.venueModel.updateOne({ _id: venueID }, { deletedCheck: true });
    }
    async deleteAllVenues() {
        return await this.venueModel.deleteMany({});
    }
};
exports.VenueService = VenueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Venues')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VenueService);
//# sourceMappingURL=venues.service.js.map