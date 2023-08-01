import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
    return this.checkIfMemberIDExists(loginDto?.memberID).then(async (response: boolean) => {
      if(response == false) {
        throw new ForbiddenException('This user is not a member');
      }
      loginDto._id = new Types.ObjectId().toString();
      return await new this._userModel(loginDto).save();
    })
  }

  async loginUser(loginDto: {email: string, password: string}): Promise<any> {
    let user  = await this._userModel.findOne({email: loginDto.email});
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

  async checkIfMemberIDExists(memberID: string): Promise<boolean> {
    const user = await this._userModel.findOne({ memberID: memberID });
    if(user) {
      return true
    }
    return false
  }
}
