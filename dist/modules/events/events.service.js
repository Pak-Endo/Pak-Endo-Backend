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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const events_schema_1 = require("../../schemas/events.schema");
const user_service_1 = require("../user/user.service");
let EventsService = exports.EventsService = class EventsService {
    constructor(eventModel, galleryModel) {
        this.eventModel = eventModel;
        this.galleryModel = galleryModel;
    }
    async getAllEvents(limit, offset, title) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        const totalCount = await this.eventModel.countDocuments({ deletedCheck: false });
        let filters = {}, sort = {};
        if (title.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, title: nameSort };
            const query = new RegExp(`${title}`, 'i');
            filters = { ...filters, title: query };
        }
        else {
            sort = { ...sort, _id: -1 };
        }
        const eventList = await this.eventModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    ...filters
                }
            },
            {
                $project: {
                    description: 1,
                    title: 1,
                    eventStatus: 1,
                    deletedCheck: 1,
                    gallery: 1,
                    endDate: 1,
                    startDate: 1,
                    agenda: 1,
                    featuredImage: { $concat: [process.env.URL, '$featuredImage'] }
                }
            },
            {
                $addFields: {
                    gallery: {
                        $ifNull: ["$gallery", [null]]
                    }
                }
            },
            {
                $unwind: "$gallery"
            },
            {
                $addFields: {
                    "gallery.mediaUrl": {
                        $map: {
                            input: "$gallery.mediaUrl",
                            as: "url",
                            in: { $concat: [process.env.URL, "$$url"] }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    event: { $first: "$$ROOT" },
                    gallery: { $addToSet: "$gallery" }
                }
            },
            {
                $addFields: {
                    "event.gallery": "$gallery"
                }
            },
            {
                $replaceRoot: { newRoot: "$event" }
            },
            {
                $sort: sort
            }
        ])
            .skip(Number(offset))
            .limit(Number(limit));
        return {
            events: eventList,
            totalCount: totalCount
        };
    }
    async getUpcomingEvents(limit, offset, title) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        const upComingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: events_schema_1.EventStatus.UPCOMING });
        let filters = {}, sort = {};
        if (title.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, title: nameSort };
            const query = new RegExp(`${title}`, 'i');
            filters = { ...filters, title: query };
        }
        else {
            sort = { ...sort, _id: -1 };
        }
        const eventList = await this.eventModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    eventStatus: events_schema_1.EventStatus.UPCOMING,
                    ...filters
                }
            },
            {
                $project: {
                    description: 1,
                    title: 1,
                    eventStatus: 1,
                    deletedCheck: 1,
                    gallery: 1,
                    endDate: 1,
                    startDate: 1,
                    agenda: 1,
                    featuredImage: { $concat: [process.env.URL, '$featuredImage'] }
                }
            },
            {
                $addFields: {
                    gallery: {
                        $ifNull: ["$gallery", [null]]
                    }
                }
            },
            {
                $unwind: "$gallery"
            },
            {
                $addFields: {
                    "gallery.mediaUrl": {
                        $map: {
                            input: "$gallery.mediaUrl",
                            as: "url",
                            in: { $concat: [process.env.URL, "$$url"] }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    event: { $first: "$$ROOT" },
                    gallery: { $addToSet: "$gallery" }
                }
            },
            {
                $addFields: {
                    "event.gallery": "$gallery"
                }
            },
            {
                $replaceRoot: { newRoot: "$event" }
            },
            {
                $sort: sort
            }
        ])
            .skip(Number(offset))
            .limit(Number(limit));
        return {
            events: eventList,
            totalCount: upComingCount
        };
    }
    async getOnGoingEvents(limit, offset, title) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        const onGoingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: events_schema_1.EventStatus.ONGOING });
        let filters = {}, sort = {};
        if (title.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, title: nameSort };
            const query = new RegExp(`${title}`, 'i');
            filters = { ...filters, title: query };
        }
        else {
            sort = { ...sort, _id: -1 };
        }
        const eventList = await this.eventModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    eventStatus: events_schema_1.EventStatus.ONGOING,
                    ...filters
                }
            },
            {
                $project: {
                    description: 1,
                    title: 1,
                    eventStatus: 1,
                    deletedCheck: 1,
                    gallery: 1,
                    endDate: 1,
                    startDate: 1,
                    agenda: 1,
                    featuredImage: { $concat: [process.env.URL, '$featuredImage'] }
                }
            },
            {
                $addFields: {
                    gallery: {
                        $ifNull: ["$gallery", [null]]
                    }
                }
            },
            {
                $unwind: "$gallery"
            },
            {
                $addFields: {
                    "gallery.mediaUrl": {
                        $map: {
                            input: "$gallery.mediaUrl",
                            as: "url",
                            in: { $concat: [process.env.URL, "$$url"] }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    event: { $first: "$$ROOT" },
                    gallery: { $addToSet: "$gallery" }
                }
            },
            {
                $addFields: {
                    "event.gallery": "$gallery"
                }
            },
            {
                $replaceRoot: { newRoot: "$event" }
            },
            {
                $sort: sort
            }
        ])
            .skip(Number(offset))
            .limit(Number(limit));
        return {
            events: eventList,
            totalCount: onGoingCount
        };
    }
    async getFinishedEvents(limit, offset, title) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        const finishedCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: events_schema_1.EventStatus.FINSIHED });
        let filters = {}, sort = {};
        if (title.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, title: nameSort };
            const query = new RegExp(`${title}`, 'i');
            filters = { ...filters, title: query };
        }
        else {
            sort = { ...sort, _id: -1 };
        }
        const eventList = await this.eventModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    eventStatus: events_schema_1.EventStatus.FINSIHED,
                    ...filters
                }
            },
            {
                $project: {
                    description: 1,
                    title: 1,
                    eventStatus: 1,
                    deletedCheck: 1,
                    gallery: 1,
                    endDate: 1,
                    startDate: 1,
                    agenda: 1,
                    featuredImage: { $concat: [process.env.URL, '$featuredImage'] }
                }
            },
            {
                $addFields: {
                    gallery: {
                        $ifNull: ["$gallery", [null]]
                    }
                }
            },
            {
                $unwind: "$gallery"
            },
            {
                $addFields: {
                    "gallery.mediaUrl": {
                        $map: {
                            input: "$gallery.mediaUrl",
                            as: "url",
                            in: { $concat: [process.env.URL, "$$url"] }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    event: { $first: "$$ROOT" },
                    gallery: { $addToSet: "$gallery" }
                }
            },
            {
                $addFields: {
                    "event.gallery": "$gallery"
                }
            },
            {
                $replaceRoot: { newRoot: "$event" }
            },
            {
                $sort: sort
            }
        ])
            .skip(Number(offset))
            .limit(Number(limit));
        return {
            events: eventList,
            totalCount: finishedCount
        };
    }
    async createNewEvent(eventDto) {
        const event = await this.eventModel.findOne({ title: eventDto.title, deletedCheck: false });
        if (event) {
            throw new common_1.ForbiddenException('An event by this title already exists');
        }
        eventDto._id = new mongoose_2.Types.ObjectId().toString();
        eventDto.featuredImage = eventDto.featuredImage?.split(process.env.URL)[1];
        eventDto.eventStatus = events_schema_1.EventStatus.UPCOMING;
        eventDto.deletedCheck = false;
        if (eventDto?.gallery && eventDto?.gallery?.mediaUrl?.length > 0) {
            eventDto.gallery._id = new mongoose_2.Types.ObjectId().toString();
            eventDto.gallery.eventID = eventDto._id;
            eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
                value = value?.split(process.env.URL)[1];
                return value;
            });
            await new this.galleryModel(eventDto?.gallery).save();
        }
        return await new this.eventModel(eventDto).save();
    }
    async updateEvent(eventDto, eventID) {
        let updatedGallery = {};
        let updatedGal;
        const event = await this.eventModel.findOne({ _id: eventID, deletedCheck: false });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        if (eventDto.featuredImage) {
            eventDto.featuredImage = eventDto.featuredImage?.split(process.env.URL)[1];
        }
        if (eventDto?.gallery && eventDto?.gallery?.mediaUrl?.length > 0) {
            if (event?.gallery?._id) {
                eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
                    value = value?.split(process.env.URL)[1];
                    return value;
                });
                updatedGal = await this.galleryModel.updateOne({ _id: event?.gallery?._id }, eventDto.gallery);
                updatedGallery = await this.galleryModel.findOne({ _id: event?.gallery?._id });
            }
            else {
                eventDto.gallery._id = new mongoose_2.Types.ObjectId().toString();
                eventDto.gallery.eventID = eventDto._id || event?._id;
                eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
                    value = value?.split(process.env.URL)[1];
                    return value;
                });
                updatedGal = await new this.galleryModel(eventDto?.gallery).save();
                updatedGallery = await this.galleryModel.findOne({ _id: eventDto?.gallery?._id });
            }
        }
        if (updatedGallery) {
            eventDto.gallery = updatedGallery;
        }
        let updatedEvent = await this.eventModel.updateOne({ _id: eventID }, eventDto);
        if (updatedEvent) {
            return await this.eventModel.findOne({ _id: eventID });
        }
    }
    async deleteEvent(eventID) {
        const event = await this.eventModel.findOne({ _id: eventID, deletedCheck: false });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return await this.eventModel.updateOne({ _id: eventID }, { deletedCheck: true });
    }
    async getEventStats() {
        const totalCount = await this.eventModel.countDocuments({ deletedCheck: false });
        const upComingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: events_schema_1.EventStatus.UPCOMING });
        const OnGoingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: events_schema_1.EventStatus.ONGOING });
        const finishedCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: events_schema_1.EventStatus.FINSIHED });
        return {
            total: totalCount,
            upComing: upComingCount,
            onGoing: OnGoingCount,
            finished: finishedCount
        };
    }
    async getUpcomingEventsForCalendar(limit, offset) {
        limit = Number(limit) < 1 ? 20 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        const totalCount = await this.eventModel.countDocuments({ deletedCheck: false });
        const eventList = await this.eventModel.aggregate([
            {
                $match: {
                    deletedCheck: false
                }
            },
            {
                $project: {
                    title: 1,
                    endDate: 1,
                    startDate: 1,
                    eventStatus: 1
                }
            }
        ])
            .skip(Number(offset))
            .limit(Number(limit));
        return {
            events: eventList,
            totalCount: totalCount
        };
    }
};
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Events')),
    __param(1, (0, mongoose_1.InjectModel)('Gallery')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], EventsService);
//# sourceMappingURL=events.service.js.map