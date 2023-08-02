import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/login.dto';
import { User } from 'src/schemas/user.schema';

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

  async registerUser(loginDto: User | any): Promise<any> {
    const user = await this._userModel.findOne({ email: loginDto.email });
    if(user) {
      throw new ForbiddenException('Email already exists');
    }
    loginDto._id = new Types.ObjectId().toString();
    loginDto.type = loginDto?.memberID?.split('/')[1].trim();
    return await new this._userModel(loginDto).save();
  }

  async loginUser(loginDto: LoginDto): Promise<any> {
    let user  = await this._userModel.findOne({ email: loginDto.email, deletedCheck: false });
    if(!user) {
      throw new UnauthorizedException('Incorrect Credentials')
    }
    const isValidCredentials = await bcrypt.compare(loginDto.password, user.password);
    if(!isValidCredentials) {
      throw new UnauthorizedException('Incorrect Credentials')
    }
    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    const token = this.generateToken(user);
    return { user, token: token.access_token};
  }

  async checkIfMemberIDExists(memberID: string) {
    const user = await this._userModel.findOne({
      memberID: memberID
    });
    return user ? true : false
  }
}
