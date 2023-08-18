import { AuthService } from './auth.service';
import { MemberCheckDto, PasswordDto, UserDto, approveDto } from 'src/dto/user.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AdminLoginDto } from 'src/dto/admin-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<any>;
    signup(signupDto: UserDto): Promise<any>;
    checkMember(memberDto: MemberCheckDto): Promise<boolean>;
    loginAdmin(loginDto: AdminLoginDto): Promise<any>;
    sendForgotPassEmail(email: string): Promise<any>;
    resetUserPassword(passDto: PasswordDto): Promise<any>;
    approveUser(userData: approveDto, id: string): Promise<any>;
}
