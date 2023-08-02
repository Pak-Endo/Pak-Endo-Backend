import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { QueryParams, UserDto } from 'src/dto/user.dto';
import { User, UserRole } from 'src/schemas/user.schema';

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
  constructor(@InjectModel('User') private readonly _userModel: Model<User>) {}

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
          ...filters
        }
      },
      {
        $sort: sort
      }
    ])
    .skip(Number(params.offset))
    .limit(Number(params.limit));

    return {
      users: usersList,
      totalCount: totalCount
    }
  }

  async getUserById(id: string): Promise<any> {
    let user =  await this._userModel.findById({_id: id, deletedCheck: false});
    if(!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  async updateUser(userDto: UserDto, userId: string): Promise<any> {
    const user = await this._userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    let updatedUser = await this._userModel.updateOne({ _id: userId }, userDto);
    if(updatedUser) {
      return await this._userModel.findOne({ _id: userId });
    }
  }
}
