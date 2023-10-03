import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminDto, MemberCheckDto, PasswordDto, UserDto, approveDto } from 'src/dto/user.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AdminLoginDto } from 'src/dto/admin-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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

  @Post('signupAdmin')
  async signupAdmin(@Body() signupDto: AdminDto) {
    return await this.authService.registerAdmin(signupDto);
  }

  @Post('checkIfMemberExistsWithPassword')
  async checkMember(@Body() memberDto: MemberCheckDto) {
    return await this.authService.checkIfMemberIDExistsWithPassword(memberDto?.memberID);
  }

  @Post('loginAdmin')
  async loginAdmin(@Body() loginDto: AdminLoginDto) {
    return await this.authService.loginUser(loginDto);
  }

  @Post('forgotPassword/:email')
  async sendForgotPassEmail(@Param('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @Post('resetPassword')
  async resetUserPassword(@Body() passDto: PasswordDto) {
    return await this.authService.resetPassword(passDto);
  }

  @Put('approveUser/:id')
  async approveUser(
    @Body() userData: approveDto,
    @Param('id') id: string
  ) {
    return await this.authService.approveUser(id, userData);
  }

  @Delete('deleteAllUsers')
    async deleteAllUsers() {
      return await this.authService.deleteAllUsers()
    }
}
