import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventStatus, Event } from 'src/schemas/events.schema';
import { SORT } from '../user/user.service';
import { EventDto } from 'src/dto/event.dto';
import { Gallery } from 'src/schemas/gallery.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Events') private readonly eventModel: Model<Event>,
    @InjectModel('Gallery') private readonly galleryModel: Model<Gallery>
  ) {}

  async getAllEvents(limit: number, offset: number, title?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
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
          featuredImage: {$concat: [process.env.URL, '$featuredImage']}
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
          featuredImage: {$concat: [process.env.URL, '$featuredImage']}
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
          featuredImage: {$concat: [process.env.URL, '$featuredImage']}
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
          featuredImage: {$concat: [process.env.URL, '$featuredImage']}
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
    const event = await this.eventModel.findOne({ title: eventDto.title, deletedCheck: false });
    if(event) {
      throw new ForbiddenException('An event by this title already exists');
    }
    eventDto._id = new Types.ObjectId().toString();
    eventDto.featuredImage = eventDto.featuredImage?.split(process.env.URL)[1];
    eventDto.startDate = new Date(eventDto.startDate).getTime();
    eventDto.endDate = new Date(eventDto.endDate).getTime();
    eventDto.eventStatus = EventStatus.UPCOMING;
    eventDto.deletedCheck = false;
    if(eventDto?.gallery && eventDto?.gallery?.mediaUrl?.length > 0) {
      eventDto.gallery._id = new Types.ObjectId().toString();
      eventDto.gallery.eventID = eventDto._id;
      eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
        value = value?.split(process.env.URL)[1];
        return value
      })
      await new this.galleryModel(eventDto?.gallery).save();
    }
    return await new this.eventModel(eventDto).save();
  }

  async updateEvent(eventDto: EventDto, eventID: string): Promise<any> {
    let updatedGallery: any = {};
    const event = await this.eventModel.findOne({ _id: eventID, deletedCheck: false });
    if(!event) {
      throw new NotFoundException('Event not found');
    }
    if(eventDto.featuredImage) {
      eventDto.featuredImage = eventDto.featuredImage?.split(process.env.URL)[1];
    }
    if(eventDto.startDate) {
      eventDto.startDate = new Date(eventDto.startDate).getTime();
    }
    if(eventDto.endDate) {
      eventDto.endDate = new Date(eventDto.endDate).getTime();
    }
    if(eventDto?.gallery && eventDto?.gallery?.mediaUrl?.length > 0) {
      eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
        value = value?.split(process.env.URL)[1];
        return value
      })
      let updatedGal = await this.galleryModel.updateOne({ _id: event?.gallery?._id }, eventDto.gallery);
      if(updatedGal) {
        updatedGallery = await this.galleryModel.findOne({ _id: event?.gallery?._id })
      }
    }
    eventDto.gallery = updatedGallery;
    let updatedEvent = await this.eventModel.updateOne({ _id: eventID }, eventDto);
    if(updatedEvent) {
      return await this.eventModel.findOne({ _id: eventID });
    }
  }

  async deleteEvent(eventID: string): Promise<any> {
    const event = await this.eventModel.findOne({ _id: eventID, deletedCheck: false });
    if(!event) {
      throw new NotFoundException('Event not found');
    }
    return await this.eventModel.updateOne({_id: eventID, deletedCheck: true})
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
    const upComingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: EventStatus.UPCOMING });
    const eventList = await this.eventModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          eventStatus: EventStatus.UPCOMING
        }
      },
      {
        $project: {
          title: 1,
          endDate: 1,
          startDate: 1,
        }
      }
    ])
    .skip(Number(offset))
    .limit(Number(limit));

    return {
      events: eventList,
      totalCount: upComingCount
    }
  }
}
