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
exports.SpeakerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/user.service");
let SpeakerService = exports.SpeakerService = class SpeakerService {
    constructor(speakerModel) {
        this.speakerModel = speakerModel;
    }
    async getAllSpeakers(limit, offset, speakerName) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        let filters = {}, sort = {};
        if (speakerName && speakerName.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, speakerName: nameSort };
            const query = new RegExp(`${speakerName}`, 'i');
            filters = { ...filters, speakerName: query };
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
        const countResult = await this.speakerModel.aggregate(countPipeline).exec();
        const totalCount = countResult.length > 0 ? countResult[0].count : 0;
        const speakerList = await this.speakerModel.aggregate([
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
            data: speakerList
        };
    }
    async getSpeakerById(speakerID) {
        const speakerExists = await this.speakerModel.findOne({ _id: speakerID, deletedCheck: false });
        if (!speakerExists) {
            throw new common_1.NotFoundException('Speaker Does not exist');
        }
        const speaker = await this.speakerModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    _id: speakerID
                }
            }
        ]);
        return speaker;
    }
    async addNewSpeaker(speaker) {
        const speakerExists = await this.speakerModel.findOne({ uniqueID: speaker.uniqueID, deletedCheck: false });
        if (speakerExists) {
            throw new common_1.ForbiddenException('Speaker already exists');
        }
        speaker._id = new mongoose_2.Types.ObjectId().toString();
        speaker.deletedCheck = false;
        return await new this.speakerModel(speaker).save();
    }
    async updateSpeaker(speakerID, speakerData) {
        const speakerExists = await this.speakerModel.findOne({ _id: speakerID, deletedCheck: false });
        if (!speakerExists) {
            throw new common_1.NotFoundException('Speaker not found');
        }
        speakerData.deletedCheck = false;
        let updatedSpeaker = await this.speakerModel.updateOne({ _id: speakerID }, speakerData);
        if (updatedSpeaker) {
            return { message: 'Speaker updated successfully' };
        }
    }
    async deleteSpeaker(speakerID) {
        const speakerExists = await this.speakerModel.findOne({ _id: speakerID, deletedCheck: false });
        if (!speakerExists) {
            throw new common_1.NotFoundException('Speaker not found');
        }
        return await this.speakerModel.updateOne({ _id: speakerID }, { deletedCheck: true });
    }
};
exports.SpeakerService = SpeakerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Speakers')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SpeakerService);
//# sourceMappingURL=speakers.service.js.map