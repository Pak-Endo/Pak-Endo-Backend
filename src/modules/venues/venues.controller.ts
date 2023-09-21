import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VenueService } from './venues.service';
import { VenueDto } from 'src/dto/venue.dto';

@ApiTags('Venues')
@ApiBearerAuth()
@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post('addVenue')
  @UseGuards(JwtAuthGuard)
  async postNewVenue(
    @Body() venueDto: VenueDto
  ) {
    return await this.venueService.addNewVenue(venueDto);
  }

  @Put('updateVenue/:venueID')
  @UseGuards(JwtAuthGuard)
  async updateVenueData(
    @Body() venueDto: VenueDto,
    @Param('venueID') venueID: string
  ) {
    return await this.venueService.updateVenue(venueID, venueDto);
  }

  @Delete('deleteVenue/:venueID')
  @UseGuards(JwtAuthGuard)
  async deleteVenueByID(
    @Param('venueID') venueID: string
  ) {
    return await this.venueService.deleteVenue(venueID)
  }

  @Get('getAllVenues')
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'offset', required: true, type: Number })
  @ApiQuery({ name: 'venueName', required: false, type: String })
  async fetchAllVenues(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('venueName') venueName?: string
  ) {
    return await this.venueService.getAllVenues(limit, offset, venueName);
  }

  @Get('getVenueByID/:venueID')
  @UseGuards(JwtAuthGuard)
  async fetchVenueByID(
    @Param('venueID') sponsorID: string
  ) {
    return await this.venueService.getVenueById(sponsorID)
  }
}
