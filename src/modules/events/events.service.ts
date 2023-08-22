import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventStatus, Event } from 'src/schemas/events.schema';
import { SORT } from '../user/user.service';
import { EventDto } from 'src/dto/event.dto';
import { Gallery } from 'src/schemas/gallery.schema';
import { Agenda } from 'src/schemas/agenda.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Events') private readonly eventModel: Model<Event>,
    @InjectModel('Gallery') private readonly galleryModel: Model<Gallery>,
    @InjectModel('Agenda') private readonly agendaModel: Model<Agenda>
  ) {}

  async getAllEvents(limit: number, offset: number, title?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    const totalCount = await this.eventModel.countDocuments({ deletedCheck: false });
    let filters = {},
        sort = {};
    if(title.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, title: nameSort }
      const query = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    else {
      sort = {...sort, _id: -1 }
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
          type: 1,
          location: 1,
          organizer: 1,
          organizerContact: 1,
          featuredImage: { $concat: [process.env.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", [null] ]
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
    }
  }

  async getUpcomingEvents(limit: number, offset: number, title?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    const upComingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: EventStatus.UPCOMING });
    let filters = {},
        sort = {};
    if(title.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, title: nameSort }
      const query = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    else {
      sort = {...sort, _id: -1 }
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
          featuredImage: { $concat: [process.env.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", [null] ]
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
    }
  }

  async getOnGoingEvents(limit: number, offset: number, title?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    const onGoingCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: EventStatus.ONGOING });
    let filters = {},
        sort = {};
    if(title.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, title: nameSort }
      const query = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    else {
      sort = {...sort, _id: -1 }
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
          featuredImage: { $concat: [process.env.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", [null] ]
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
    }
  }

  async getFinishedEvents(limit: number, offset: number, title?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    const finishedCount = await this.eventModel.countDocuments({ deletedCheck: false, eventStatus: EventStatus.FINSIHED });
    let filters = {},
        sort = {};
    if(title.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, title: nameSort }
      const query = new RegExp(`${title}`, 'i');
      filters = {...filters, title: query}
    }
    else {
      sort = {...sort, _id: -1 }
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
          featuredImage: { $concat: [process.env.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", [null] ]
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
    }
  }

  async createNewEvent(eventDto: EventDto): Promise<any> {
    const event = await this.eventModel.findOne({ title: eventDto.title, deletedCheck: false });
    if(event) {
      throw new ForbiddenException('An event by this title already exists');
    }
    eventDto._id = new Types.ObjectId().toString();
    eventDto.featuredImage = eventDto.featuredImage?.split(process.env.URL)[1];
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
    if(eventDto?.agenda && eventDto?.agenda?.length > 0) {
      for await (const agenda of eventDto.agenda) {
        agenda._id = new Types.ObjectId().toString();
        agenda.streamUrl = '';
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
          agenda.streamUrl = '';
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
          value = value?.split(process.env.URL)[1];
          return value
        })
        await this.galleryModel.updateOne({ _id: event?.gallery?._id }, eventDto.gallery);
      }
      else {
  
        eventDto.gallery._id = new Types.ObjectId().toString();
        eventDto.gallery.eventID = eventDto._id || event?._id;
        eventDto.gallery.mediaUrl = eventDto?.gallery?.mediaUrl?.map(value => {
          value = value?.split(process.env.URL)[1];
          return value
        })
        await new this.galleryModel(eventDto?.gallery).save();
      }

    }
    if(eventDto.featuredImage) {
      eventDto.featuredImage = eventDto.featuredImage?.split(process.env.URL)[1];
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
          featuredImage: { $concat: [process.env.URL, '$featuredImage'] }
        }
      },
      {
        $addFields: {
          gallery: {
            $ifNull: [ "$gallery", [null] ]
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
