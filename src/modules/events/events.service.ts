import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventStatus, Event } from 'src/schemas/events.schema';
import { SORT } from '../user/user.service';
import { EventDto } from 'src/dto/event.dto';
import { Gallery } from 'src/schemas/gallery.schema';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Events') private readonly eventModel: Model<Event>,
    @InjectModel('Gallery') private readonly galleryModel: Model<Gallery>,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  async getAllEvents(limit: number, offset: number, title?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let stringConcat = String(this.request.headers?.host)
    const totalCount = await this.eventModel.countDocuments({ deletedCheck: false });
    let filters = {},
        sort = {};
    if(title) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, title: nameSort}
    }
    if(title.trim().length) {
      const query = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    const eventList = await this.eventModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          ...filters
        }
      },
      {
        $sort: sort
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
          streamUrl: 1,
          featuredImage: {$concat: [stringConcat, '$featuredImage']}
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
              in: { $concat: [stringConcat, "$$url"] }
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
      events: eventList,
      totalCount: totalCount
    }
  }

  async getUpcomingEvents(limit: number, offset: number, title?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let stringConcat = String(this.request.headers?.host)
    const upComingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: EventStatus.UPCOMING });
    let filters = {},
        sort = {};
    if(title) {
      let nameSort = SORT.ASC ? 1: -1;
      sort = {...sort, title: nameSort}
    }
    if(title.trim()?.length) {
      let query  = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    const eventList = await this.eventModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          eventStatus: EventStatus.UPCOMING,
          ...filters
        }
      },
      {
        $sort: sort
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
          streamUrl: 1,
          featuredImage: {$concat: [stringConcat, '$featuredImage']}
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
              in: { $concat: [stringConcat, "$$url"] }
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
      events: eventList,
      totalCount: upComingCount
    }
  }

  async getOnGoingEvents(limit: number, offset: number, title?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let stringConcat = String(this.request.headers?.host)
    const onGoingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: EventStatus.ONGOING });
    let filters = {},
        sort = {};
    if(title) {
      let nameSort = SORT.ASC ? 1: -1;
      sort = {...sort, title: nameSort}
    }
    if(title.trim()?.length) {
      let query  = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    const eventList = await this.eventModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          eventStatus: EventStatus.ONGOING,
          ...filters
        }
      },
      {
        $sort: sort
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
          streamUrl: 1,
          featuredImage: {$concat: [stringConcat, '$featuredImage']}
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
              in: { $concat: [stringConcat, "$$url"] }
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
      events: eventList,
      totalCount: onGoingCount
    }
  }

  async getFinishedEvents(limit: number, offset: number, title?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let stringConcat = String(this.request.headers?.host)
    const finishedCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: EventStatus.FINSIHED });
    let filters = {},
        sort = {};
    if(title) {
      let nameSort = SORT.ASC ? 1: -1;
      sort = {...sort, title: nameSort}
    }
    if(title.trim()?.length) {
      let query  = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    const eventList = await this.eventModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          eventStatus: EventStatus.FINSIHED,
          ...filters
        }
      },
      {
        $sort: sort
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
          streamUrl: 1,
          featuredImage: {$concat: [stringConcat, '$featuredImage']}
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
              in: { $concat: [stringConcat, "$$url"] }
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
      events: eventList,
      totalCount: finishedCount
    }
  }

  async createNewEvent(eventDto: EventDto): Promise<any> {
    const event = await this.eventModel.findOne({ title: eventDto.title });
    if(event) {
      throw new ForbiddenException('An event by this title already exists');
    }
    eventDto._id = new Types.ObjectId().toString();
    eventDto.featuredImage = eventDto.featuredImage?.split(this.request.headers?.origin)[1];
    eventDto.startDate = new Date(eventDto.startDate).getTime();
    eventDto.endDate = new Date(eventDto.endDate).getTime();
    eventDto.eventStatus = EventStatus.UPCOMING;
    eventDto.deletedCheck = false;
    if(eventDto?.gallery && eventDto?.gallery?.mediaUrl?.length > 0) {
      eventDto.gallery._id = new Types.ObjectId().toString();
      eventDto.gallery.eventID = eventDto._id;
      eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
        value = value?.split(this.request.headers?.origin)[1];
        return value
      })
      await new this.galleryModel(eventDto?.gallery).save();
    }
    return await new this.eventModel(eventDto).save();
  }
}
