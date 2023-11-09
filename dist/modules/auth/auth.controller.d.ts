import { AuthService } from './auth.service';
import { AdminDto, MemberCheckDto, PasswordDto, UserDto, approveDto, DeviceDto } from 'src/dto/user.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AdminLoginDto } from 'src/dto/admin-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<any>;
    signup(signupDto: UserDto): Promise<any>;
    signupAdmin(signupDto: AdminDto): Promise<any>;
    checkMember(memberDto: MemberCheckDto): Promise<boolean>;
    loginAdmin(loginDto: AdminLoginDto): Promise<any>;
    sendForgotPassEmail(email: string): Promise<any>;
    resetUserPassword(passDto: PasswordDto): Promise<any>;
    approveUser(userData: approveDto, id: string): Promise<any>;
    deleteAllUsers(): Promise<import("mongodb").DeleteResult>;
    adddevice(deviceDto: DeviceDto): Promise<any>;
}
