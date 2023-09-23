import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { SORT } from "../user/user.service";
import { Sponsor } from "src/schemas/sponsor.schema";
import { SponsorDto } from "src/dto/sponsor.dto";

@Injectable()
export class SponsorService {
  constructor(
    @InjectModel('Sponsors') private readonly sponsorModel: Model<Sponsor>,
  ) {}

  async getAllSponsors(limit: number, offset: number, sponsorName?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let filters = {},
        sort = {};
    if(sponsorName && sponsorName.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, sponsorName: nameSort }
      const query = new RegExp(`${sponsorName}`, 'i');
      filters = {...filters, sponsorName: query}
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
    const countResult = await this.sponsorModel.aggregate(countPipeline).exec();
    const totalCount = countResult.length > 0 ? countResult[0].count : 0;
    const sponsorList = await this.sponsorModel.aggregate([
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
      data: sponsorList
    }
  }

  async getSponsorById(sponsorID: string): Promise<any> {
    const sponsorExists = await this.sponsorModel.findOne({_id: sponsorID, deletedCheck: false});
    if(!sponsorExists) {
      throw new NotFoundException('Sponsor Does not exist')
    }
    const sponsor = await this.sponsorModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          _id: sponsorID
        }
      }
    ]);
    return sponsor
  }

  async addNewSponsor(sponsor: SponsorDto): Promise<any> {
    const sponsorExists = await this.sponsorModel.findOne({ sponsorName: sponsor.sponsorName, deletedCheck: false });
    if(sponsorExists) {
      throw new ForbiddenException('Spomsor already exists');
    }
    sponsor._id = new Types.ObjectId().toString();
    sponsor.deletedCheck = false;
    return await new this.sponsorModel(sponsor).save();
  }

  async updateSponsor(sponsorID: string, sponsorData: SponsorDto): Promise<any> {
    const sponsorExists = await this.sponsorModel.findOne({ _id: sponsorID, deletedCheck: false });
    if(!sponsorExists) {
      throw new NotFoundException('Sponsor not found');
    }
    sponsorData.deletedCheck = false;
    let updatedSponsor = await this.sponsorModel.updateOne({ _id: sponsorID }, sponsorData);
    if(updatedSponsor) {
      return {message: 'Sponsor updated successfully'}
    }
  }

  async deleteSponsor(sponsorID: string): Promise<any> {
    const sponsorExists = await this.sponsorModel.findOne({ _id: sponsorID, deletedCheck: false });
    if(!sponsorExists) {
      throw new NotFoundException('sponsor not found');
    }
    return await this.sponsorModel.updateOne({_id: sponsorID}, {deletedCheck: true})
  }
}