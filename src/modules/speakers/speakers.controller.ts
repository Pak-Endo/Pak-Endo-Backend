import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SpeakerService } from './speakers.service';
import { SpeakerDto } from 'src/dto/speaker.dto';

@ApiTags('Speakers')
@ApiBearerAuth()
@Controller('speakers')
export class SpeakerController {
  constructor(private readonly speakerService: SpeakerService) {}

  @Post('addSpeaker')
  @UseGuards(JwtAuthGuard)
  async postNewSpeaker(
    @Body() speakerDto: SpeakerDto
  ) {
    return await this.speakerService.addNewSpeaker(speakerDto);
  }

  @Put('updateSpeaker/:speakerID')
  @UseGuards(JwtAuthGuard)
  async updateSpeakerData(
    @Body() speakerDto: SpeakerDto,
    @Param('speakerID') speakerID: string
  ) {
    return await this.speakerService.updateSpeaker(speakerID, speakerDto);
  }

  @Delete('deleteSpeaker/:speakerID')
  @UseGuards(JwtAuthGuard)
  async deleteSpeakerByID(
    @Param('speakerID') speakerID: string
  ) {
    return await this.speakerService.deleteSpeaker(speakerID)
  }

  @Get('getAllSpeakers')
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'offset', required: true, type: Number })
  @ApiQuery({ name: 'speakerName', required: false, type: String })
  async fetchAllSpeakers(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('speakerName') speakerName?: string
  ) {
    return await this.speakerService.getAllSpeakers(limit, offset, speakerName);
  }

  @Get('getSpeakerByID/:speakerID')
  @UseGuards(JwtAuthGuard)
  async fetchSpeakerByID(
    @Param('speakerID') speakerID: string
  ) {
    return await this.speakerService.getSpeakerById(speakerID)
  }
}
