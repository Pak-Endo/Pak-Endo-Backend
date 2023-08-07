import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventDto } from 'src/dto/event.dto';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Post('createNewEvent')
  @UseGuards(JwtAuthGuard)
  async postNewEvent(
    @Body() eventDto: EventDto
  ) {
    return await this.eventService.createNewEvent(eventDto);
  }

  @Get('getllEvents')
  @UseGuards(JwtAuthGuard)
  async fetchAllEvents(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query ('title') title?: string
  ) {
    return await this.eventService.getAllEvents(limit, offset, title)
  }

  @Get('getUpcomingEvents')
  @UseGuards(JwtAuthGuard)
  async fetchUpcomingEvents(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query ('title') title?: string
  ) {
    return await this.eventService.getUpcomingEvents(limit, offset, title)
  }

  @Get('getOnGoingEvents')
  @UseGuards(JwtAuthGuard)
  async fetchOnGoingEvents(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query ('title') title?: string
  ) {
    return await this.eventService.getOnGoingEvents(limit, offset, title)
  }

  @Get('getFinishedEvents')
  @UseGuards(JwtAuthGuard)
  async fetchFinishedEvents(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query ('title') title?: string
  ) {
    return await this.eventService.getFinishedEvents(limit, offset, title)
  }
}
