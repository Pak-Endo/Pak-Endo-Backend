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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let FavoritesService = exports.FavoritesService = class FavoritesService {
    constructor(favModel, eventModel) {
        this.favModel = favModel;
        this.eventModel = eventModel;
    }
    async addToFavorites(favoritesDto, req) {
        try {
            const post = await this.eventModel.findById({
                _id: favoritesDto.eventID,
                deletedCheck: false,
            });
            if (!post) {
                throw new common_1.HttpException('Post not found', common_1.HttpStatus.NOT_FOUND);
            }
            else {
                const checkIfAlreadyFavorite = await this.favModel.findOne({
                    eventID: favoritesDto.eventID,
                    userID: req.user.id,
                    deletedCheck: false,
                });
                if (checkIfAlreadyFavorite) {
                    return { message: 'Event already exists in your favorites' };
                }
                else {
                    favoritesDto.userID = req.user.id;
                    await new this.favModel({ eventID: favoritesDto.eventID, userID: req.user.id, deletedCheck: false, _id: new mongoose_2.Types.ObjectId().toString() }).save();
                    return {
                        message: 'Added to favourites',
                    };
                }
            }
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removeFromFavourites(eventID, req) {
        try {
            const checkIfExists = await this.favModel.findOne({
                eventID: eventID,
                userID: req.user.id,
                deletedCheck: false,
            });
            if (checkIfExists) {
                await this.favModel.deleteOne({ _id: checkIfExists._id });
                return { message: 'Removed from favorites' };
            }
            else {
                throw new common_1.HttpException('Event does not exist in favorites', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getFavourite(id, req) {
        try {
            const checkIfExists = await this.favModel.aggregate([
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
                throw new common_1.HttpException('Event does not exist in favorites', common_1.HttpStatus.NOT_FOUND);
            }
            return checkIfExists;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllFavorites(offset, limit, req) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const allFavourites = await this.favModel
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
                        "events.isFavorite": true,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            const eventsArrays = [].concat(...allFavourites.map(item => item.events));
            return {
                totalCount: eventsArrays?.length,
                data: eventsArrays,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Favorites')),
    __param(1, (0, mongoose_1.InjectModel)('Events')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map