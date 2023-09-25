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
exports.SponsorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/user.service");
let SponsorService = exports.SponsorService = class SponsorService {
    constructor(sponsorModel) {
        this.sponsorModel = sponsorModel;
    }
    async getAllSponsors(limit, offset, sponsorName) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        let filters = {}, sort = {};
        if (sponsorName && sponsorName.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, sponsorName: nameSort };
            const query = new RegExp(`${sponsorName}`, 'i');
            filters = { ...filters, sponsorName: query };
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
        const countResult = await this.sponsorModel.aggregate(countPipeline).exec();
        const totalCount = countResult.length > 0 ? countResult[0].count : 0;
        const sponsorList = await this.sponsorModel.aggregate([
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
            data: sponsorList
        };
    }
    async getSponsorById(sponsorID) {
        const sponsorExists = await this.sponsorModel.findOne({ _id: sponsorID, deletedCheck: false });
        if (!sponsorExists) {
            throw new common_1.NotFoundException('Sponsor Does not exist');
        }
        const sponsor = await this.sponsorModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    _id: sponsorID
                }
            }
        ]);
        return sponsor;
    }
    async addNewSponsor(sponsor) {
        const sponsorExists = await this.sponsorModel.findOne({ sponsorName: sponsor.sponsorName, deletedCheck: false });
        if (sponsorExists) {
            throw new common_1.ForbiddenException('Spomsor already exists');
        }
        sponsor._id = new mongoose_2.Types.ObjectId().toString();
        sponsor.deletedCheck = false;
        return await new this.sponsorModel(sponsor).save();
    }
    async updateSponsor(sponsorID, sponsorData) {
        const sponsorExists = await this.sponsorModel.findOne({ _id: sponsorID, deletedCheck: false });
        if (!sponsorExists) {
            throw new common_1.NotFoundException('Sponsor not found');
        }
        sponsorData.deletedCheck = false;
        let updatedSponsor = await this.sponsorModel.updateOne({ _id: sponsorID }, sponsorData);
        if (updatedSponsor) {
            return { message: 'Sponsor updated successfully' };
        }
    }
    async deleteSponsor(sponsorID) {
        const sponsorExists = await this.sponsorModel.findOne({ _id: sponsorID, deletedCheck: false });
        if (!sponsorExists) {
            throw new common_1.NotFoundException('sponsor not found');
        }
        return await this.sponsorModel.updateOne({ _id: sponsorID }, { deletedCheck: true });
    }
};
exports.SponsorService = SponsorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Sponsors')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SponsorService);
//# sourceMappingURL=sponsors.service.js.map