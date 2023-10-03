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
exports.AttendedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("../../config");
let AttendedService = exports.AttendedService = class AttendedService {
    constructor(attendModel, eventModel) {
        this.attendModel = attendModel;
        this.eventModel = eventModel;
    }
    async addToAttended(AttendedDto, req) {
        try {
            const post = await this.eventModel.findById({
                _id: AttendedDto.eventID,
                deletedCheck: false,
            });
            if (!post) {
                throw new common_1.HttpException('Event not found', common_1.HttpStatus.NOT_FOUND);
            }
            else {
                const checkIfAlreadyFavorite = await this.attendModel.findOne({
                    eventID: AttendedDto.eventID,
                    userID: req.user.id,
                    deletedCheck: false,
                });
                if (checkIfAlreadyFavorite) {
                    return { message: 'Event already exists in your attended events' };
                }
                else {
                    AttendedDto.userID = req.user.id;
                    await new this.attendModel({ eventID: AttendedDto.eventID, userID: req.user.id, deletedCheck: false, _id: new mongoose_2.Types.ObjectId().toString() }).save();
                    return {
                        message: 'Added to attended events',
                    };
                }
            }
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAttended(id, req) {
        try {
            const checkIfExists = await this.attendModel.aggregate([
                {
                    $match: {
                        eventID: id,
                        userID: req.user.id,
                        deletedCheck: false
                    }
                },
                {
                    $project: {
                        __v: 0,
                        _id: 0
                    }
                }
            ]);
            if (!checkIfExists) {
                throw new common_1.HttpException('Event does not exist in Attended', common_1.HttpStatus.NOT_FOUND);
            }
            return checkIfExists;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllAttended(offset, limit, req) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const allFavourites = await this.attendModel
                .aggregate([
                {
                    $match: {
                        deletedCheck: false,
                        userID: req.user.id
                    },
                },
                {
                    $lookup: {
                        from: "events",
                        localField: 'eventID',
                        foreignField: '_id',
                        as: 'events'
                    }
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        events: 1
                    }
                },
                {
                    $addFields: {
                        "events.isAttended": true,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            const eventsArrays = [].concat(...allFavourites.map(item => item.events));
            eventsArrays.forEach(event => {
                event.featuredImage = config_1.default.URL + event.featuredImage;
                if (event.gallery && event.gallery.mediaUrl) {
                    event.gallery.mediaUrl = event.gallery.mediaUrl.map(media => config_1.default.URL + media);
                }
            });
            return {
                totalCount: eventsArrays?.length,
                data: eventsArrays,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteAllAttended() {
        return await this.attendModel.deleteMany({});
    }
};
exports.AttendedService = AttendedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Attended')),
    __param(1, (0, mongoose_1.InjectModel)('Events')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AttendedService);
//# sourceMappingURL=attended.service.js.map