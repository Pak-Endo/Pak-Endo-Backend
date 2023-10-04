import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SponsorService } from './sponsors.service';
import { SponsorDto } from 'src/dto/sponsor.dto';

@ApiTags('Sponsors')
@ApiBearerAuth()
@Controller('sponsors')
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  @Post('addSponsor')
  @UseGuards(JwtAuthGuard)
  async postNewSponsor(
    @Body() sponsorDto: SponsorDto
  ) {
    return await this.sponsorService.addNewSponsor(sponsorDto);
  }

  @Put('updateSponsor/:sponsorID')
  @UseGuards(JwtAuthGuard)
  async updateSponsorData(
    @Body() sponsorDto: SponsorDto,
    @Param('sponsorID') sponsorID: string
  ) {
    return await this.sponsorService.updateSponsor(sponsorID, sponsorDto);
  }

  @Delete('deleteSponsor/:sponsorID')
  @UseGuards(JwtAuthGuard)
  async deleteSponsorByID(
    @Param('sponsorID') sponsorID: string
  ) {
    return await this.sponsorService.deleteSponsor(sponsorID)
  }

  @Get('getAllSponsors')
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'offset', required: true, type: Number })
  @ApiQuery({ name: 'sponsorName', required: false, type: String })
  async fetchAllSponsors(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('sponsorName') sponsorName?: string
  ) {
    return await this.sponsorService.getAllSponsors(limit, offset, sponsorName);
  }

  @Get('getSponsorByID/:sponsorID')
  @UseGuards(JwtAuthGuard)
  async fetchSponsorByID(
    @Param('sponsorID') sponsorID: string
  ) {
    return await this.sponsorService.getSponsorById(sponsorID)
  }

  @Delete('deleteAllSponsors')
    @UseGuards(JwtAuthGuard)
    async deleteAllSponsors() {
      return await this.sponsorService.deleteAllSponsors()
    }
}
