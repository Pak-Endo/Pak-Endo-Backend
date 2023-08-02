import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/login.dto';
import { User } from 'src/schemas/user.schema';
import { AdminLoginDto } from 'src/dto/admin-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly _userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  private generateToken(payload: any) {
    return {
      access_token: `Bearer ${this.jwtService.sign(payload)}`
    }
  }

  private async commonLoginMethod(user: User | any, password: string) {
    if(!user) {
      throw new UnauthorizedException('Incorrect Credentials')
    }
    const isValidCredentials = await bcrypt.compare(password, user.password);
    if(!isValidCredentials) {
      throw new UnauthorizedException('Incorrect Credentials')
    }
    !user.fullName ? user.fullName = user?.prefix + ' ' + user?.firstName + ' ' + user?.lastName : user.fullName;
    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    const token = this.generateToken(user);
    return { user, token: token.access_token};
  }

  async registerUser(newUser: User | any): Promise<any> {
    const user = await this._userModel.findOne({ email: newUser.email });
    if(user) {
      throw new ForbiddenException('Email already exists');
    }
    newUser._id = new Types.ObjectId().toString();
    newUser.type = newUser?.memberID?.split('/')[1].trim();
    newUser.fullName = newUser?.prefix + ' ' + newUser?.firstName + ' ' + newUser?.lastName;
    return await new this._userModel(newUser).save();
  }

  async loginUser(loginDto: LoginDto | AdminLoginDto | any): Promise<any> {
    if(loginDto?.memberID) {
      let user  = await this._userModel.findOne({ memberID: loginDto.memberID, deletedCheck: false });
      return this.commonLoginMethod(user, loginDto?.password)
    }
    let user  = await this._userModel.findOne({ email: loginDto.email, deletedCheck: false });
    return this.commonLoginMethod(user, loginDto?.password)
  }

  async checkIfMemberIDExistsWithPassword(memberID: string) {
    const user = await this._userModel.findOne({
      memberID: memberID
    });
    if(user) {
      return user?.password ? true : false
    }
    return false
  }

  async checkIfMemberIDExists(memberID: string) {
    const user = await this._userModel.findOne({
      memberID: memberID
    });
    return user ? true : false
  }
}
