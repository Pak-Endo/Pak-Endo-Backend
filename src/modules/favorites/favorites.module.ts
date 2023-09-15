import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteSchema } from 'src/schemas/favorites.schema';
import { FavoritesController } from './favorites.controller';
import { EventSchema } from 'src/schemas/events.schema';

@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Favorites', schema: FavoriteSchema},
        {name: 'Events', schema: EventSchema},
    ])],
    providers: [FavoritesService],
    controllers: [FavoritesController]
})
export class FavoritesModule {}
