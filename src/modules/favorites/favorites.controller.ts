import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoritesService } from './favorites.service';
import { FavoritesDto } from 'src/dto/favorites.dto';

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favService: FavoritesService) {}

  @Get('getAllFavorites')
    @UseGuards(JwtAuthGuard)
    async getFavorites(
      @Query('limit') limit: number = 10,
      @Query('offset') offset: number = 0,
      @Req() req: any
    ) {
      return await this.favService.getAllFavorites(offset, limit, req);
    }

    @Get('getFavoriteByID/:id')
    @UseGuards(JwtAuthGuard)
    async getFavById(
      @Param('id') id: string,
      @Req() req
    ) {
      return await this.favService.getFavourite(id, req);
    }

    @Post('addToFavorites')
    @UseGuards(JwtAuthGuard)
    async addToFavs(@Body() favoritesDto: FavoritesDto, @Req() req) {
      return await this.favService.addToFavorites(favoritesDto, req)
    }

    @Get('removeFromFavourites/:eventID')
    @UseGuards(JwtAuthGuard)
    removeFromFavourites (
        @Param('eventID') eventID: string,
        @Req() req,
    ) {
      return this.favService.removeFromFavourites(eventID, req)
    }
}
