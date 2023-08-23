import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { User } from 'src/schemas/user.schema';
import { AdminLoginDto } from 'src/dto/admin-login.dto';
import { MailService } from '../mail/mail.service';
import { PasswordDto, approveDto } from 'src/dto/user.dto';
export declare class AuthService {
    private readonly _userModel;
    private jwtService;
    private mailService;
    constructor(_userModel: Model<User>, jwtService: JwtService, mailService: MailService);
    private generateToken;
    private commonLoginMethod;
    registerUser(newUser: User | any): Promise<any>;
    addAdmin(newUser: User | any): Promise<any>;
    loginUser(loginDto: LoginDto | AdminLoginDto | any): Promise<any>;
    checkIfMemberIDExistsWithPassword(memberID: string): Promise<boolean>;
    checkIfMemberIDExists(memberID: string): Promise<boolean>;
    forgotPassword(email: string): Promise<any>;
    resetPassword(passwordDto: PasswordDto): Promise<any>;
    approveUser(id: string, userData: approveDto): Promise<any>;
}
