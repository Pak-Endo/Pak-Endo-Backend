import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import config from 'src/config';
import { AttendedDto } from 'src/dto/attended.dto';
import { FavoritesDto } from 'src/dto/favorites.dto';
import { Event } from 'src/schemas/events.schema';
import { Attended } from 'src/schemas/interested.schema';

@Injectable()
export class AttendedService {
  constructor(
    @InjectModel('Attended') private readonly attendModel: Model<Attended>,
    @InjectModel('Events') private readonly eventModel: Model<Event>,
  ) {}

  async addToAttended(AttendedDto: AttendedDto, req: any) {
    try {
      const post = await this.eventModel.findById({
        _id: AttendedDto.eventID,
        deletedCheck: false,
      });
      if (!post) {
        throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
      } else {
        const checkIfAlreadyFavorite = await this.attendModel.findOne({
          eventID: AttendedDto.eventID,
          userID: req.user.id,
          deletedCheck: false,
        });
        if (checkIfAlreadyFavorite) {
          return {message: 'Event already exists in your attended events'}
        }
        else {
          AttendedDto.userID = req.user.id;
          await new this.attendModel(
            {eventID: AttendedDto.eventID, userID: req.user.id, deletedCheck: false, _id: new Types.ObjectId().toString()}
          ).save()
          return {
            message: 'Added to attended events',
          };
        }
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getAttended(id: string, req: any) {
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
      if(!checkIfExists) {
        throw new HttpException('Event does not exist in Attended', HttpStatus.NOT_FOUND)
      }
      return checkIfExists;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllAttended(offset: any, limit: any, req: any) {
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
        event.featuredImage = config.URL + event.featuredImage;
  
        if (event.gallery && event.gallery.mediaUrl) {
          event.gallery.mediaUrl = event.gallery.mediaUrl.map(
            media => config.URL + media
          );
        }
      });
      return {
        totalCount: eventsArrays?.length,
        data: eventsArrays,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}