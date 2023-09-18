import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AttendedService } from './attended.service';
import { AttendedDto } from 'src/dto/attended.dto';

@ApiTags('Attended')
@ApiBearerAuth()
@Controller('attended')
export class AttendedController {
  constructor(private readonly attendService: AttendedService) {}

  @Get('getAllAttended')
    @UseGuards(JwtAuthGuard)
    async getAttended(
      @Query('limit') limit: number = 10,
      @Query('offset') offset: number = 0,
      @Req() req: any
    ) {
      return await this.attendService.getAllAttended(offset, limit, req);
    }

    @Get('getAttendedEventByID/:id')
    @UseGuards(JwtAuthGuard)
    async getFavById(
      @Param('id') id: string,
      @Req() req
    ) {
      return await this.attendService.getAttended(id, req)
    }

    @Post('addToAttendedEvents')
    @UseGuards(JwtAuthGuard)
    async addToAttendedEvents(@Body() AttendedDto: AttendedDto, @Req() req) {
      return await this.attendService.addToAttended(AttendedDto, req)
    }
}
