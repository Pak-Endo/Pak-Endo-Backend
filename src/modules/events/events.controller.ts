import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
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

  @Put('updateEvent/:eventID')
  @UseGuards(JwtAuthGuard)
  async updateEventData(
    @Body() eventDto: EventDto,
    @Param('eventID') eventID: string
  ) {
    return await this.eventService.updateEvent(eventDto, eventID);
  }

  @Delete('deleteEvent/:eventID')
  @UseGuards(JwtAuthGuard)
  async deleteEventByID(
    @Param('eventID') eventID: string
  ) {
    return await this.eventService.deleteEvent(eventID)
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

  @Get('getEventStats')
  @UseGuards(JwtAuthGuard)
  async fetchEventStats() {
    return await this.eventService.getEventStats();
  }

  @Get('getEventsForCalendar')
  @UseGuards(JwtAuthGuard)
  async fetchEventsForCalendar(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return await this.eventService.getUpcomingEventsForCalendar(limit, offset);
  }

  @Get('getEventByID/:eventID')
  @UseGuards(JwtAuthGuard)
  async fetchEventByID(
    @Param('eventID') eventID: string
  ) {
    return await this.eventService.getEventByID(eventID)
  }
}
