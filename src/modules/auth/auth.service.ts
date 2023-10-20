import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/login.dto';
import { Status, Type, User, UserRole } from 'src/schemas/user.schema';
import { AdminLoginDto } from 'src/dto/admin-login.dto';
import { MailService } from '../mail/mail.service';
import { AdminDto, PasswordDto, UserDto, approveDto } from 'src/dto/user.dto';

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
    if(user?.status !== Status.APPROVED)  {
      
      throw new UnauthorizedException('Your account is still pending for approval');
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
    const user = await this._userModel.findOne({ email: newUser.email, deletedCheck: false });
    if(user) {
      throw new ForbiddenException('Email already exists');
    }
    newUser.status = Status.PENDING;
    newUser._id = new Types.ObjectId().toString();
    newUser.role = 'member';
    newUser.fullName = newUser?.prefix + ' ' + newUser?.firstName + ' ' + newUser?.lastName;
    
    newUser.deviceToken = newUser?.deviceToken;
    newUser.deviceId = newUser?.deviceId;
    newUser.isAndroid = newUser?.isAndroid;
    
    await this.mailService.sendApprovalRequestToAdmin(newUser);
    return await new this._userModel(newUser).save();
  }

  async registerAdmin(newUser: AdminDto): Promise<any> {
    const user = await this._userModel.findOne({ email: newUser.email });
    if(user) {
      throw new ForbiddenException('Email already exists');
    }
    let adminExists = await this._userModel.findOne({role: UserRole.ADMIN});
    if(adminExists) {
      throw new ForbiddenException('Admin user already exists');
    }
    newUser.status = Status.APPROVED;
    newUser._id = new Types.ObjectId().toString();
    newUser.role = 'admin';
    newUser.memberID = 'PES/SA/0';
    newUser.fullName = newUser?.prefix + ' ' + newUser?.firstName + ' ' + newUser?.lastName;
    return await new this._userModel(newUser).save();
  }

  async loginUser(loginDto: LoginDto | AdminLoginDto | any): Promise<any> {
    if(loginDto?.memberID) {
      let user = await this._userModel.findOne(
        {$or:
          [
            { memberID: loginDto.memberID},
            { email: loginDto.memberID }
          ],
          deletedCheck: false,
          status: Status.APPROVED
        },
      );
      if(!user) {
        throw new UnauthorizedException('This user has not been approved yet')
      }
      user.deviceToken=loginDto.deviceToken;
      await this._userModel.updateOne({email: loginDto.memberID}, {deviceToken: loginDto.deviceToken})
      return this.commonLoginMethod(user, loginDto?.password)
    }
    
    let user = await this._userModel.findOne({ email: loginDto.email, deletedCheck: false, status: Status.APPROVED });
    
    if(user?.role !== UserRole.ADMIN) {
      
      throw new UnauthorizedException('Incorrect Credentials')
    }
    user.deviceToken=loginDto.deviceToken;
    await this._userModel.updateOne({email: loginDto.memberID}, {deviceToken: loginDto.deviceToken})
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

  async approveUser(id: string, userData: approveDto): Promise<any> {
    let user =  await this._userModel.findById({_id: id, deletedCheck: false});
    if(!user) {
      throw new NotFoundException('User does not exist');
    }
    if(user?.memberID || user?.memberID !== "") {
      throw new BadRequestException('User is already approved');
    }
    if(!user?.memberID || user?.memberID == "") {
      let usersByMemberID = await this._userModel.aggregate([
        {
          $match: {
            deletedCheck: false,
            memberID: new RegExp(`/(?<=/)${userData.type}(?=/)`)
          }
        },
        {
          $project: {
            _id: 0,
            memberID: 1
          }
        }
      ]).sort({memberID: -1});

      let data: any = new Object(Type);
      let memberShipType: string = '';
      for (const key in data) {
        if(key == userData.type) {
          memberShipType = data[key]
        }
      }
      if(usersByMemberID?.length > 0) {
        usersByMemberID = usersByMemberID.sort((a, b) => {
          const numA = parseInt(a.memberID.split('/')[2]);
          const numB = parseInt(b.memberID.split('/')[2]);
          return numA - numB;
        });
        let newMemberID = 0;
        const lastMemberID = usersByMemberID[usersByMemberID.length - 1]?.memberID;
        if (lastMemberID) {
            const matchResult = lastMemberID.match(/\d+/);
            if (matchResult) {
                newMemberID = parseInt(matchResult[0], 10) + 1;
            }
        }
        let memberIDGen = `PES/${userData?.type}/${newMemberID}`;
        let emailNotif = await this.mailService.sendEmailToMember(user, memberIDGen, memberShipType);
        if(!emailNotif) {
          throw new BadRequestException('Something went wrong. Please try again')
        }
        return await this._userModel.updateOne(
          {_id: id, deletedCheck: false},
          { ...userData, status: Status.APPROVED, memberID: memberIDGen }
        )
      }
      else {
        let memberIDGen = `PES/${userData?.type}/0`;
        let emailNotif = await this.mailService.sendEmailToMember(user, memberIDGen, memberShipType);
        if(!emailNotif) {
          throw new BadRequestException('Something went wrong. Please try again')
        }
        return await this._userModel.updateOne(
          {_id: id, deletedCheck: false},
          { ...userData, status: Status.APPROVED, memberID: memberIDGen }
        )
      }
    }
    return await this._userModel.updateOne(
      {_id: id, deletedCheck: false},
      { ...userData, status: Status.APPROVED }
    )
  }

  async deleteAllUsers() {
    return await this._userModel.deleteMany({});
  }

  async addDeviceToken(newUser: User | any): Promise<any> {
    const user = await this._userModel.findOne({ email: newUser.email });
    if(user) {
      user.deviceId = newUser?.deviceId;
      user.deviceToken = newUser?.deviceToken;
      user.isAndroid = newUser?.isAndroid;
    }else{
      throw new NotFoundException('User does not exist');
    }
    return await user.save();
  }
}
