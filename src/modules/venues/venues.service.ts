import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { SORT } from "../user/user.service";
import { Venue } from "src/schemas/venues.schema";
import { VenueDto } from "src/dto/venue.dto";

@Injectable()
export class VenueService {
  constructor(
    @InjectModel('Venues') private readonly venueModel: Model<Venue>,
  ) {}

  async getAllVenues(limit: number, offset: number, venueName?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let filters = {},
        sort = {};
    if(venueName && venueName.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, venueName: nameSort }
      const query = new RegExp(`${venueName}`, 'i');
      filters = {...filters, venueName: query}
    }
    else {
      sort = {...sort, createdAt: -1 }
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
    const countResult = await this.venueModel.aggregate(countPipeline).exec();
    const totalCount = countResult.length > 0 ? countResult[0].count : 0;
    const venueList = await this.venueModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          ...filters
        }
      },
      {
        $sort: sort
      }
    ])
    .skip(Number(offset))
    .limit(Number(limit));

    return {
      totalCount,
      data: venueList
    }
  }

  async getVenueById(venueID: string): Promise<any> {
    const venueExists = await this.venueModel.findOne({_id: venueID, deletedCheck: false});
    if(!venueExists) {
      throw new NotFoundException('Venue Does not exist')
    }
    const venue = await this.venueModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          _id: venueID
        }
      }
    ]);
    return venue
  }

  async addNewVenue(venue: VenueDto): Promise<any> {
    const venueExists = await this.venueModel.findOne({ venueName: venue.venueName, city: venue.city, deletedCheck: false });
    if(venueExists) {
      throw new BadRequestException('Venue already exists');
    }
    venue._id = new Types.ObjectId().toString();
    venue.deletedCheck = false;
    return await new this.venueModel(venue).save();
  }

  async updateVenue(venueID: string, venueData: VenueDto): Promise<any> {
    const venueExists = await this.venueModel.findOne({ _id: venueID, deletedCheck: false });
    if(!venueExists) {
      throw new NotFoundException('Venue not found');
    }
    venueData.deletedCheck = false;
    let updatedVenue = await this.venueModel.updateOne({ _id: venueID }, venueData);
    if(updatedVenue) {
      return {message: 'Venue updated successfully'}
    }
  }

  async deleteVenue(venueID: string): Promise<any> {
    const venueExists = await this.venueModel.findOne({ _id: venueID, deletedCheck: false });
    if(!venueExists) {
      throw new NotFoundException('Venue not found');
    }
    return await this.venueModel.updateOne({_id: venueID}, {deletedCheck: true})
  }

  async deleteAllVenues() {
    return await this.venueModel.deleteMany({});
  }
}