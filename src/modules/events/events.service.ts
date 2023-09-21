import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventStatus, Event } from 'src/schemas/events.schema';
import { SORT } from '../user/user.service';
import { EventDto } from 'src/dto/event.dto';
import { Gallery } from 'src/schemas/gallery.schema';
import { Agenda } from 'src/schemas/agenda.schema';
import config from 'src/config';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Events') private readonly eventModel: Model<Event>,
    @InjectModel('Gallery') private readonly galleryModel: Model<Gallery>,
    @InjectModel('Agenda') private readonly agendaModel: Model<Agenda>
  ) {}

  async getAllEvents(limit: number, offset: number, userID?: string, title?: string, location?: string, type?: string, startDate?: number, endDate?: number, speaker?: string, status?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let filters = {},
        sort = {};
    if(title && title.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, title: nameSort }
      const query = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    else {
      sort = {...sort, createdAt: -1 }
    }
    if(location) {
      const query = new RegExp(`${location}`, 'i');
      filters = {...filters, location: query}
    }
    if(type) {
      const query = new RegExp(`${type}`, 'i');
      filters = {...filters, type: query}
    }
    if(startDate) {
      filters = {...filters, startDate: { $gte: Number(startDate) }}
    }
    if(endDate) {
      filters = {...filters, endDate: { $lte: Number(endDate) }}
    }
    if (speaker) {
      const query = new RegExp(`${speaker}`, 'i');
      filters = {
        ...filters,
        "agenda.speaker": query
      }
    }
    if (status) {
      filters = {
        ...filters,
        eventStatus: status
      }
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
          openForPublic: 1,
          fees: 1,
          featuredImage: { $concat: [config.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", {} ]
          }
        }
      },
      {
        $unwind: {
          path: "$gallery",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          "gallery.mediaUrl": {
            $cond: {
              if: { $isArray: "$gallery.mediaUrl" },
              then: "$gallery.mediaUrl",
              else: []
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
    }
  }

  async getAllEventsByCategory(limit: number, offset: number, userID?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    const totalCount = await this.eventModel.countDocuments({ deletedCheck: false });
    const upcomingEvents = await this.eventModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          eventStatus: EventStatus.UPCOMING
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
          isFavorite: 1,
          isAttended: 1,
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
          fees: 1,
          featuredImage: { $concat: [config.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", {} ]
          }
        }
      },
      {
        $unwind: {
          path: "$gallery",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          "gallery.mediaUrl": {
            $cond: {
              if: { $isArray: "$gallery.mediaUrl" },
              then: "$gallery.mediaUrl",
              else: []
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
        $sort: {
          createdAt: -1,
        },
      },
    ])
    .skip(Number(offset))
    .limit(Number(limit));

    const onGoingEvents = await this.eventModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          eventStatus: EventStatus.ONGOING
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
          isFavorite: 1,
          isAttended: 1,
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
          fees: 1,
          featuredImage: { $concat: [config.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", {} ]
          }
        }
      },
      {
        $unwind: {
          path: "$gallery",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          "gallery.mediaUrl": {
            $cond: {
              if: { $isArray: "$gallery.mediaUrl" },
              then: "$gallery.mediaUrl",
              else: []
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
        $sort: {
          createdAt: -1,
        },
      }
    ])
    .skip(Number(offset))
    .limit(Number(limit));

    const finishedEvents = await this.eventModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          eventStatus: EventStatus.FINSIHED
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
          isFavorite: 1,
          isAttended: 1,
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
          fees: 1,
          featuredImage: { $concat: [config.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", {} ]
          }
        }
      },
      {
        $unwind: {
          path: "$gallery",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          "gallery.mediaUrl": {
            $cond: {
              if: { $isArray: "$gallery.mediaUrl" },
              then: "$gallery.mediaUrl",
              else: []
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
        $sort: {
          createdAt: -1,
        },
      }
    ])
    .skip(Number(offset))
    .limit(Number(limit));
    

    return {
      upcomingEvents,
      finishedEvents,
      onGoingEvents,
      totalCount: totalCount
    }
  }

  async getUpcomingEvents(limit: number, offset: number, title?: string, userID?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let filters = {},
        sort = {};
    if(title && title.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, title: nameSort }
      const query = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    else {
      sort = {...sort, createdAt: -1 }
    }
    const countPipeline = [
      {
        $match: {
          deletedCheck: false,
          status: EventStatus.UPCOMING,
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
          eventStatus: EventStatus.UPCOMING,
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
          isFavorite: 1,
          isAttended: 1,
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
          openForPublic: 1,
          fees: 1,
          featuredImage: { $concat: [config.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", {} ]
          }
        }
      },
      {
        $unwind: {
          path: "$gallery",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          "gallery.mediaUrl": {
            $cond: {
              if: { $isArray: "$gallery.mediaUrl" },
              then: "$gallery.mediaUrl",
              else: []
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
    }
  }

  async getOnGoingEvents(limit: number, offset: number, title?: string, userID?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let filters = {},
        sort = {};
    if(title && title.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, title: nameSort }
      const query = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    else {
      sort = {...sort, createdAt: -1 }
    }
    const countPipeline = [
      {
        $match: {
          deletedCheck: false,
          status: EventStatus.ONGOING,
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
          eventStatus: EventStatus.ONGOING,
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
          isFavorite: 1,
          isAttended: 1,
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
          openForPublic: 1,
          type: 1,
          fees: 1,
          featuredImage: { $concat: [config.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", {} ]
          }
        }
      },
      {
        $unwind: {
          path: "$gallery",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          "gallery.mediaUrl": {
            $cond: {
              if: { $isArray: "$gallery.mediaUrl" },
              then: "$gallery.mediaUrl",
              else: []
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
    }
  }

  async getFinishedEvents(limit: number, offset: number, title?: string, userID?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let filters = {},
        sort = {};
    if(title && title.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, title: nameSort }
      const query = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    else {
      sort = {...sort, createdAt: -1 }
    }
    const countPipeline = [
      {
        $match: {
          deletedCheck: false,
          status: EventStatus.UPCOMING,
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
          eventStatus: EventStatus.FINSIHED,
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
          isFavorite: 1,
          isAttended: 1,
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
          openForPublic: 1,
          fees: 1,
          featuredImage: { $concat: [config.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", {} ]
          }
        }
      },
      {
        $unwind: {
          path: "$gallery",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          "gallery.mediaUrl": {
            $cond: {
              if: { $isArray: "$gallery.mediaUrl" },
              then: "$gallery.mediaUrl",
              else: []
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
    }
  }

  async createNewEvent(eventDto: EventDto): Promise<any> {
    if(!eventDto.featuredImage?.includes(config.URL)) {
      throw new BadRequestException('Featured Image URL is not valid')
    }
    eventDto._id = new Types.ObjectId().toString();
    eventDto.featuredImage = eventDto.featuredImage?.split(config.URL)[1];
    eventDto.eventStatus = EventStatus.UPCOMING;
    eventDto.deletedCheck = false;
    if(eventDto?.gallery && eventDto?.gallery?.mediaUrl?.length > 0) {

      eventDto.gallery._id = new Types.ObjectId().toString();
      eventDto.gallery.eventID = eventDto._id;
      eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
        value = value?.split(config.URL)[1];
        return value
      })

      await new this.galleryModel(eventDto?.gallery).save();
    }
    if(eventDto?.agenda && eventDto?.agenda?.length > 0) {
      for await (const agenda of eventDto.agenda) {
        agenda._id = new Types.ObjectId().toString();
        await new this.agendaModel(agenda).save();
      }
    }
    return await new this.eventModel(eventDto).save();
  }

  async updateEvent(eventDto: EventDto, eventID: string): Promise<any> {
    let updatedGal;
    const event = await this.eventModel.findOne({ _id: eventID, deletedCheck: false });
    if(!event) {
      throw new NotFoundException('Event not found');
    }
    if(eventDto.agenda) {
      for await (const agenda of eventDto.agenda) {
        if(!agenda._id) {
          agenda._id = new Types.ObjectId().toString();
          await new this.agendaModel(agenda).save();
        }
        else {
          await this.agendaModel.updateOne({ _id: agenda?._id }, agenda);
        }
      }
    }
    if(eventDto?.gallery && eventDto?.gallery?.mediaUrl?.length > 0) {

      if(event?.gallery?._id) {
  
        eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
          value = value?.split(config.URL)[1];
          return value
        })
        await this.galleryModel.updateOne({ _id: event?.gallery?._id }, eventDto.gallery);
      }
      else {
  
        eventDto.gallery._id = new Types.ObjectId().toString();
        eventDto.gallery.eventID = eventDto._id || event?._id;
        eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
          value = value?.split(config.URL)[1];
          return value
        })
        await new this.galleryModel(eventDto?.gallery).save();
      }

    }
    if(eventDto.featuredImage) {
      eventDto.featuredImage = eventDto.featuredImage?.split(config.URL)[1];
    }
    let updatedEvent = await this.eventModel.updateOne({ _id: eventID }, eventDto);
    if(updatedEvent) {
      return await this.eventModel.findOne({ _id: eventID });
    }
  }

  async getEventByID(eventID: string): Promise<any> {
    const event = await this.eventModel.findOne({_id: eventID, deletedCheck: false});
    if(!event) {
      throw new NotFoundException('Event Does not exist')
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
          featuredImage: { $concat: [config.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", {} ]
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
              in: { $concat: [config.URL, "$$url"] }
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
    return finalEvent[0]
  }

  async deleteEvent(eventID: string): Promise<any> {
    const event = await this.eventModel.findOne({ _id: eventID, deletedCheck: false });
    if(!event) {
      throw new NotFoundException('Event not found');
    }
    return await this.eventModel.updateOne({ _id: eventID}, {deletedCheck: true})
  }

  async getEventStats(): Promise<any> {
    const totalCount = await this.eventModel.countDocuments({ deletedCheck: false });
    const upComingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: EventStatus.UPCOMING });
    const OnGoingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: EventStatus.ONGOING });
    const finishedCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: EventStatus.FINSIHED });
    return {
      total: totalCount,
      upComing: upComingCount,
      onGoing: OnGoingCount,
      finished: finishedCount
    }
  }

  async getUpcomingEventsForCalendar(limit: number, offset: number): Promise<any> {
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
    }
  }
}
