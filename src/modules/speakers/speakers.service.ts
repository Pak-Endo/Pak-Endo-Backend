import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Speaker } from "src/schemas/speakers.schema";
import { SORT } from "../user/user.service";
import { SpeakerDto } from "src/dto/speaker.dto";

@Injectable()
export class SpeakerService {
  constructor(
    @InjectModel('Speakers') private readonly speakerModel: Model<Speaker>,
  ) {}

  async getAllSpeakers(limit: number, offset: number, speakerName?: string): Promise<any> {
    limit = Number(limit) < 1 ? 10 : Number(limit);
    offset = Number(offset) < 0 ? 0 : Number(offset);
    let filters = {},
        sort = {};
    if(speakerName && speakerName.trim().length) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, speakerName: nameSort }
      const query = new RegExp(`${speakerName}`, 'i');
      filters = {...filters, speakerName: query}
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
    const countResult = await this.speakerModel.aggregate(countPipeline).exec();
    const totalCount = countResult.length > 0 ? countResult[0].count : 0;
    const speakerList = await this.speakerModel.aggregate([
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
      data: speakerList
    }
  }

  async getSpeakerById(speakerID: string): Promise<any> {
    const speakerExists = await this.speakerModel.findOne({_id: speakerID, deletedCheck: false});
    if(!speakerExists) {
      throw new NotFoundException('Speaker Does not exist')
    }
    const speaker = await this.speakerModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          _id: speakerID
        }
      }
    ]);
    return speaker
  }

  async addNewSpeaker(speaker: SpeakerDto): Promise<any> {
    const speakerExists = await this.speakerModel.findOne({ uniqueID: speaker.uniqueID, deletedCheck: false });
    if(speakerExists) {
      throw new ForbiddenException('Speaker already exists');
    }
    speaker._id = new Types.ObjectId().toString();
    speaker.deletedCheck = false;
    return await new this.speakerModel(speaker).save();
  }

  async updateSpeaker(speakerID: string, speakerData: SpeakerDto): Promise<any> {
    const speakerExists = await this.speakerModel.findOne({ _id: speakerID, deletedCheck: false });
    if(!speakerExists) {
      throw new NotFoundException('Speaker not found');
    }
    speakerData.deletedCheck = false;
    let updatedSpeaker = await this.speakerModel.updateOne({ _id: speakerID }, speakerData);
    if(updatedSpeaker) {
      return {message: 'Speaker updated successfully'}
    }
  }

  async deleteSpeaker(speakerID: string): Promise<any> {
    const speakerExists = await this.speakerModel.findOne({ _id: speakerID, deletedCheck: false });
    if(!speakerExists) {
      throw new NotFoundException('Speaker not found');
    }
    return await this.speakerModel.updateOne({_id: speakerID}, {deletedCheck: true})
  }
}