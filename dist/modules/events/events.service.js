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
const config_1 = require("../../config");
let EventsService = exports.EventsService = class EventsService {
    constructor(eventModel, galleryModel, agendaModel) {
        this.eventModel = eventModel;
        this.galleryModel = galleryModel;
        this.agendaModel = agendaModel;
    }
    async getAllEvents(limit, offset, userID, title, location, type, startDate, endDate, speaker) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        let filters = {}, sort = {};
        if (title && title.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, title: nameSort };
            const query = new RegExp(`${title}`, 'i');
            filters = { ...filters, title: query };
        }
        else {
            sort = { ...sort, _id: -1 };
        }
        if (location) {
            const query = new RegExp(`${location}`, 'i');
            filters = { ...filters, location: query };
        }
        if (type) {
            const query = new RegExp(`${type}`, 'i');
            filters = { ...filters, type: query };
        }
        if (startDate) {
            filters = { ...filters, startDate: { $gte: Number(startDate) } };
        }
        if (endDate) {
            filters = { ...filters, endDate: { $lte: Number(endDate) } };
        }
        if (speaker) {
            const query = new RegExp(`${speaker}`, 'i');
            filters = {
                ...filters,
                "agenda.speaker": query
            };
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
        const countResult = await this.eventModel.aggregate(countPipeline).exec();
        const totalCount = countResult.length > 0 ? countResult[0].count : 0;
        const eventList = await this.eventModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    ...filters
                }
            },
            {
                $lookup: {
                    from: "favorites",
                    let: { eventId: "$_id", userId: userID },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$eventID", "$$eventId"] },
                                        { $eq: ["$userID", "$$userId"] },
                                        { $eq: ["$deletedCheck", false] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "favorites"
                }
            },
            {
                $addFields: {
                    isFavorite: { $cond: { if: { $ne: [{ $size: "$favorites" }, 0] }, then: true, else: false } }
                }
            },
            {
                $lookup: {
                    from: "attendeds",
                    let: { eventId: "$_id", userId: userID },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$eventID", "$$eventId"] },
                                        { $eq: ["$userID", "$$userId"] },
                                        { $eq: ["$deletedCheck", false] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "attendeds"
                }
            },
            {
                $addFields: {
                    isAttended: { $cond: { if: { $ne: [{ $size: "$attendeds" }, 0] }, then: true, else: false } }
                }
            },
            {
                $project: {
                    isAttended: 1,
                    isFavorite: 1,
                    description: 1,
                    title: 1,
                    eventStatus: 1,
                    deletedCheck: 1,
                    gallery: 1,
                    endDate: 1,
                    startDate: 1,
                    agenda: 1,
                    type: 1,
                    location: 1,
                    organizer: 1,
                    organizerContact: 1,
                    featuredImage: { $concat: [config_1.default.URL, '$featuredImage'] }
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
                            in: { $concat: [config_1.default.URL, "$$url"] }
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
            totalCount: totalCount,
            currentCount: eventList.length
        };
    }
    async getAllEventsByCategory(limit, offset) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        const totalCount = await this.eventModel.countDocuments({ deletedCheck: false });
        const upcomingEvents = await this.eventModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    eventStatus: events_schema_1.EventStatus.UPCOMING
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
                    type: 1,
                    location: 1,
                    organizer: 1,
                    organizerContact: 1,
                    featuredImage: { $concat: [config_1.default.URL, '$featuredImage'] }
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
                            in: { $concat: [config_1.default.URL, "$$url"] }
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
            }
        ])
            .skip(Number(offset))
            .limit(Number(limit));
        const onGoingEvents = await this.eventModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    eventStatus: events_schema_1.EventStatus.ONGOING
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
                    type: 1,
                    location: 1,
                    organizer: 1,
                    organizerContact: 1,
                    featuredImage: { $concat: [config_1.default.URL, '$featuredImage'] }
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
                            in: { $concat: [config_1.default.URL, "$$url"] }
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
            }
        ])
            .skip(Number(offset))
            .limit(Number(limit));
        const finishedEvents = await this.eventModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    eventStatus: events_schema_1.EventStatus.FINSIHED
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
                    type: 1,
                    location: 1,
                    organizer: 1,
                    organizerContact: 1,
                    featuredImage: { $concat: [config_1.default.URL, '$featuredImage'] }
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
                            in: { $concat: [config_1.default.URL, "$$url"] }
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
            }
        ])
            .skip(Number(offset))
            .limit(Number(limit));
        return {
            upcomingEvents,
            finishedEvents,
            onGoingEvents,
            totalCount: totalCount
        };
    }
    async getUpcomingEvents(limit, offset, title) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        let filters = {}, sort = {};
        if (title && title.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, title: nameSort };
            const query = new RegExp(`${title}`, 'i');
            filters = { ...filters, title: query };
        }
        else {
            sort = { ...sort, _id: -1 };
        }
        const countPipeline = [
            {
                $match: {
                    deletedCheck: false,
                    status: events_schema_1.EventStatus.UPCOMING,
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
        const countResult = await this.eventModel.aggregate(countPipeline).exec();
        const totalCount = countResult.length > 0 ? countResult[0].count : 0;
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
                    location: 1,
                    type: 1,
                    organizer: 1,
                    organizerContact: 1,
                    featuredImage: { $concat: [config_1.default.URL, '$featuredImage'] }
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
                            in: { $concat: [config_1.default.URL, "$$url"] }
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
            totalCount: totalCount,
            currentCount: eventList.length
        };
    }
    async getOnGoingEvents(limit, offset, title) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        let filters = {}, sort = {};
        if (title && title.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, title: nameSort };
            const query = new RegExp(`${title}`, 'i');
            filters = { ...filters, title: query };
        }
        else {
            sort = { ...sort, _id: -1 };
        }
        const countPipeline = [
            {
                $match: {
                    deletedCheck: false,
                    status: events_schema_1.EventStatus.ONGOING,
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
        const countResult = await this.eventModel.aggregate(countPipeline).exec();
        const totalCount = countResult.length > 0 ? countResult[0].count : 0;
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
                    location: 1,
                    organizer: 1,
                    organizerContact: 1,
                    type: 1,
                    featuredImage: { $concat: [config_1.default.URL, '$featuredImage'] }
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
                            in: { $concat: [config_1.default.URL, "$$url"] }
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
            totalCount: totalCount,
            currentCount: eventList.length
        };
    }
    async getFinishedEvents(limit, offset, title) {
        limit = Number(limit) < 1 ? 10 : Number(limit);
        offset = Number(offset) < 0 ? 0 : Number(offset);
        let filters = {}, sort = {};
        if (title && title.trim().length) {
            let nameSort = user_service_1.SORT.ASC ? 1 : -1;
            sort = { ...sort, title: nameSort };
            const query = new RegExp(`${title}`, 'i');
            filters = { ...filters, title: query };
        }
        else {
            sort = { ...sort, _id: -1 };
        }
        const countPipeline = [
            {
                $match: {
                    deletedCheck: false,
                    status: events_schema_1.EventStatus.UPCOMING,
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
        const countResult = await this.eventModel.aggregate(countPipeline).exec();
        const totalCount = countResult.length > 0 ? countResult[0].count : 0;
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
                    location: 1,
                    type: 1,
                    agenda: 1,
                    organizer: 1,
                    organizerContact: 1,
                    featuredImage: { $concat: [config_1.default.URL, '$featuredImage'] }
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
                            in: { $concat: [config_1.default.URL, "$$url"] }
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
            totalCount: totalCount,
            currentCount: eventList.length
        };
    }
    async createNewEvent(eventDto) {
        const event = await this.eventModel.findOne({ title: eventDto.title, deletedCheck: false });
        if (event) {
            throw new common_1.ForbiddenException('An event by this title already exists');
        }
        if (!eventDto.featuredImage?.includes(config_1.default.URL)) {
            throw new common_1.BadRequestException('Featured Image URL is not valid');
        }
        eventDto._id = new mongoose_2.Types.ObjectId().toString();
        eventDto.featuredImage = eventDto.featuredImage?.split(config_1.default.URL)[1];
        eventDto.eventStatus = events_schema_1.EventStatus.UPCOMING;
        eventDto.deletedCheck = false;
        if (eventDto?.gallery && eventDto?.gallery?.mediaUrl?.length > 0) {
            eventDto.gallery._id = new mongoose_2.Types.ObjectId().toString();
            eventDto.gallery.eventID = eventDto._id;
            eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
                value = value?.split(config_1.default.URL)[1];
                return value;
            });
            await new this.galleryModel(eventDto?.gallery).save();
        }
        if (eventDto?.agenda && eventDto?.agenda?.length > 0) {
            for await (const agenda of eventDto.agenda) {
                agenda._id = new mongoose_2.Types.ObjectId().toString();
                agenda.streamUrl = '';
                await new this.agendaModel(agenda).save();
            }
        }
        return await new this.eventModel(eventDto).save();
    }
    async updateEvent(eventDto, eventID) {
        let updatedGal;
        const event = await this.eventModel.findOne({ _id: eventID, deletedCheck: false });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        if (eventDto.agenda) {
            for await (const agenda of eventDto.agenda) {
                if (!agenda._id) {
                    agenda._id = new mongoose_2.Types.ObjectId().toString();
                    agenda.streamUrl = '';
                    await new this.agendaModel(agenda).save();
                }
                else {
                    await this.agendaModel.updateOne({ _id: agenda?._id }, agenda);
                }
            }
        }
        if (eventDto?.gallery && eventDto?.gallery?.mediaUrl?.length > 0) {
            if (event?.gallery?._id) {
                eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
                    value = value?.split(config_1.default.URL)[1];
                    return value;
                });
                await this.galleryModel.updateOne({ _id: event?.gallery?._id }, eventDto.gallery);
            }
            else {
                eventDto.gallery._id = new mongoose_2.Types.ObjectId().toString();
                eventDto.gallery.eventID = eventDto._id || event?._id;
                eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
                    value = value?.split(config_1.default.URL)[1];
                    return value;
                });
                await new this.galleryModel(eventDto?.gallery).save();
            }
        }
        if (eventDto.featuredImage) {
            eventDto.featuredImage = eventDto.featuredImage?.split(config_1.default.URL)[1];
        }
        let updatedEvent = await this.eventModel.updateOne({ _id: eventID }, eventDto);
        if (updatedEvent) {
            return await this.eventModel.findOne({ _id: eventID });
        }
    }
    async getEventByID(eventID) {
        const event = await this.eventModel.findOne({ _id: eventID, deletedCheck: false });
        if (!event) {
            throw new common_1.NotFoundException('Event Does not exist');
        }
        const finalEvent = await this.eventModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    _id: eventID
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
                    type: 1,
                    location: 1,
                    organizer: 1,
                    organizerContact: 1,
                    featuredImage: { $concat: [config_1.default.URL, '$featuredImage'] }
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
                            in: { $concat: [config_1.default.URL, "$$url"] }
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
            }
        ]);
        return finalEvent[0];
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
    __param(2, (0, mongoose_1.InjectModel)('Agenda')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], EventsService);
//# sourceMappingURL=events.service.js.map