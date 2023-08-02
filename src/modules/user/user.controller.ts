import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from 'src/dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getAllUsers')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('name') name?: string
  ) {
    return await this.userService.getAllUsers({limit, offset, name})
  }

  @Get('getUserById/:userID')
  @UseGuards(JwtAuthGuard)
  async getUserByID(
    @Param('userID') userID: string
  ) {
    return await this.userService.getUserById(userID)
  }

  @Put('updateUser/:userID')
  @UseGuards(JwtAuthGuard)
  async updateUserById(
    @Body() userDto: UserDto,
    @Param('userID') userID: string
  ) {
    return await this.userService.updateUser(userDto, userID)
  }
}
