import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/login.dto';
import { User } from 'src/schemas/user.schema';
import { AdminLoginDto } from 'src/dto/admin-login.dto';
import { MailService } from '../mail/mail.service';
import { PasswordDto } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly _userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService
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

  async forgotPassword(email: string): Promise<any> {
    let user = await this._userModel.findOne({ email: email, deletedCheck: false});
    if(!user) {
      throw new NotFoundException('This email is not registered to a user')
    }
    const token = Math.floor(10000 + Math.random() * 90000).toString();
    let emailNotif = await this.mailService.sendUserConfirmation(user, token);
    if(!emailNotif) {
      throw new BadRequestException('Something went wrong. Please try again')
    }
    return { message: 'An email with the link to reset your password has been sent!' }
  }

  async resetPassword(passwordDto: PasswordDto): Promise<any> {
    let user = await this._userModel.findOne({ _id: passwordDto?.userID, deletedCheck: false });
    if(!user) {
      throw new NotFoundException('User does not exist')
    }
    if(passwordDto?.newPassword?.trim() !== passwordDto?.confirmPassword?.trim()) {
      throw new BadRequestException('Passwords do not match')
    }
    const salt = await bcrypt.genSalt();
    let password = await bcrypt.hash(passwordDto?.newPassword, salt);
    if(!password) {
      throw new BadRequestException('Failed to generate password. Please try again')
    }
    let updatedUser = await this._userModel.updateOne({ _id: passwordDto?.userID }, { password: password });
    if(updatedUser) {
      return { message: 'Password saved. User updated successfully'}
    }
  }
}
