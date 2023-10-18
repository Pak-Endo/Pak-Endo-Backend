import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { QueryParams } from 'src/dto/user.dto';
import { Status, User, UserRole } from 'src/schemas/user.schema';
import { MailService } from '../mail/mail.service';

export enum SORT {
  ASC = 'Ascending',
  DESC = 'Descending',
}

class UserQueryParams extends QueryParams {
  @ApiPropertyOptional()
  name?: string
}

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly _userModel: Model<User>, private mailer: MailService) {}

  async getAllUsers(params: UserQueryParams): Promise<any> {
    params.limit = Number(params.limit) < 1 ? 10 : Number(params.limit);
    params.offset = Number(params.offset) < 0 ? 0 : Number(params.offset);
    const totalCount = await this._userModel.countDocuments({ deletedCheck: false });
    let filters = {},
        sort = {};
    if(params.name) {
      let nameSort = SORT.ASC ? 1 : -1;
      sort = {...sort, firstName: nameSort}
    }
    if(params.name.trim().length) {
      const query = new RegExp(`${params.name}`, 'i');
      filters = {...filters, firstName: query}
    }
    const usersList = await this._userModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          role: UserRole.MEMBER,
          ...filters
        }
      },
      {
        $sort: Object.keys(sort).length > 0 ? sort : {createdAt: -1}
      }
    ])
    .skip(Number(params.offset))
    .limit(Number(params.limit));

    return {
      users: usersList,
      totalCount: totalCount,
      currentCount: usersList.length
    }
  }

  async addNewUser(newUser: User | any): Promise<any> {
    const user = await this._userModel.findOne({ email: newUser.email });
    if(user) {
      throw new ForbiddenException('Email already exists');
    }
    let usersByMemberID = await this._userModel.aggregate([
      {
        $match: {
          deletedCheck: false,
          memberID: new RegExp(`/(?<=/)${newUser.type}(?=/)`)
        }
      },
      {
        $project: {
          _id: 0,
          memberID: 1,
          memberIDCount: {
            $substrBytes: [
              "$memberID", 7, 1
            ]
          }
        }
      }
    ])
    if(usersByMemberID?.length > 0) {

      let newMemberID = usersByMemberID[0]?.memberIDCount?.slice(0, -1) + `0${Number(usersByMemberID[usersByMemberID?.length - 1]?.memberIDCount) + 1}`
      let memberIDGen = `PES/${newUser?.type}/${newMemberID}`;
      newUser.memberID = memberIDGen
    }
    else {

      let memberIDGen = `PES/${newUser?.type}/00`;
      newUser.memberID = memberIDGen
    }
    newUser._id = new Types.ObjectId().toString();
    newUser.newID = new Types.ObjectId().toString();
    newUser.role = 'member';
    newUser.fullName = newUser?.firstName + ' ' + newUser?.lastName;
    newUser.status = this.setStatus(newUser.status);
    await this.mailer.sendDefaultPasswordEmail(newUser)
    return await new this._userModel(newUser).save();
  }

  async getUserById(id: string): Promise<any> {
    let user =  await this._userModel.findById({newID: id, deletedCheck: false});
    if(!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  async updateUser(userDto: User | any, userId: string): Promise<any> {
    const user = await this._userModel.findOne({ newID: userId });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    if(user.type !== userDto.type && user.role != UserRole.ADMIN) {
      let usersByMemberID = await this._userModel.aggregate([
        {
          $match: {
            deletedCheck: false,
            memberID: new RegExp(`/(?<=/)${userDto.type}(?=/)`)
          }
        },
        {
          $project: {
            _id: 0,
            memberID: 1,
            memberIDCount: {
              $substrBytes: [
                "$memberID", 7, 1
              ]
            }
          }
        }
      ])
      if(usersByMemberID?.length > 0) {
        let newMemberID = usersByMemberID[0]?.memberIDCount?.slice(0, -1) + `0${Number(usersByMemberID[usersByMemberID?.length - 1]?.memberIDCount) + 1}`
        let memberIDGen = `PES/${userDto?.type}/${newMemberID}`;
        userDto.memberID = memberIDGen
      }
      else {
        let memberIDGen = `PES/${userDto?.type}/00`;
        userDto.memberID = memberIDGen
      }
    }
    if(typeof userDto.status == 'string') {
      userDto.status = this.setStatus(userDto.status)
    }
    let updatedUser = await this._userModel.updateOne({ newID: userId }, userDto);
    if(updatedUser) {
      return await this._userModel.findOne({ newID: userId });
    }
  }

  async deleteUser(userID: string): Promise<any> {
    const event = await this._userModel.findOne({ newID: userID, deletedCheck: false });
    if(!event) {
      throw new NotFoundException('User not found');
    }
    return await this._userModel.updateOne({newID: userID}, {deletedCheck: true})
  }

  setStatus(value: string) {
    if(value === 'Approved') {
      return Status.APPROVED
    }
    if(value === 'Rejected') {
      return Status.REJECTED
    }
    if(value === 'Pending') {
      return Status.PENDING
    }
    return Status.BANNED 
  }

  async updateAllScript() {
    const users = await this._userModel.find({}); // Assuming this fetches all documents
  
    const bulkOps = users.map(user => {
      const fullName = user.fullName;
      const firstName = fullName.split('Dr. ')?.map(val => val)[0];
      const lastName = fullName.split('Dr.')?.map(val => val)[1];
  
      return {
        updateOne: {
          filter: { _id: user._id },
          update: { $set: { firstName: firstName, lastName: lastName } },
          upsert: true
        }
      };
    });
  
    await this._userModel.bulkWrite(bulkOps);
  
    // Return a summary of the update operation if necessary
    return { message: 'Update completed for all documents.' };
  }  
  

  
}
