import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { MemberCheckDto, UserDto } from 'src/dto/user.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AdminLoginDto } from 'src/dto/admin-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.loginUser(loginDto);
  }

  @Post('signup')
  async signup(@Body() signupDto: UserDto) {
    return await this.authService.registerUser(signupDto);
  }

  @Post('checkIfMemberExistsWithPassword')
  async checkMember(@Body() memberDto: MemberCheckDto) {
    return await this.authService.checkIfMemberIDExistsWithPassword(memberDto?.memberID);
  }

  @Post('loginAdmin')
  async loginAdmin(@Body() loginDto: AdminLoginDto) {
    return await this.authService.loginUser(loginDto);
  }
}
