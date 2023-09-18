import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FavoritesDto } from 'src/dto/favorites.dto';
import { Event } from 'src/schemas/events.schema';
import { Favorites } from 'src/schemas/favorites.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel('Favorites') private readonly favModel: Model<Favorites>,
    @InjectModel('Events') private readonly eventModel: Model<Event>,
  ) {}

  async addToFavorites(favoritesDto: FavoritesDto, req: any) {
    try {
      const post = await this.eventModel.findById({
        _id: favoritesDto.eventID,
        deletedCheck: false,
      });
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      } else {
        const checkIfAlreadyFavorite = await this.favModel.findOne({
          eventID: favoritesDto.eventID,
          userID: req.user.id,
          deletedCheck: false,
        });
        if (checkIfAlreadyFavorite) {
          return {message: 'Event already exists in your favorites'}
        }
        else {
          favoritesDto.userID = req.user.id;
          await new this.favModel(
            {eventID: favoritesDto.eventID, userID: req.user.id, deletedCheck: false, _id: new Types.ObjectId().toString()}
          ).save()
          return {
            message: 'Added to favourites',
          };
        }
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeFromFavourites(eventID: any, req: any) {
    try {
      const checkIfExists = await this.favModel.findOne({
        eventID: eventID,
        userID: req.user.id,
        deletedCheck: false,
      });
      if(checkIfExists) {
        await this.favModel.updateOne({_id: checkIfExists.id, deletedCheck: true});
        return {message: 'Removed from favorites'}
      }
      else {
        throw new HttpException('Event does not exist in favorites', HttpStatus.NOT_FOUND)
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  async getFavourite(id: string, req: any) {
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
      if(!checkIfExists) {
        throw new HttpException('Event does not exist in favorites', HttpStatus.NOT_FOUND)
      }
      return checkIfExists;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllFavorites(offset: any, limit: any) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this.favModel.countDocuments({
        deletedCheck: false,
      });

      const allFavourites = await this.favModel
        .aggregate([
          {
            $match: {
              deletedCheck: false,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $project: {
              __v: 0,
              _id: 0
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        totalFavouriteEvents: totalCount,
        data: allFavourites,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}