import { Model } from 'mongoose';
import { FavoritesDto } from 'src/dto/favorites.dto';
import { Event } from 'src/schemas/events.schema';
import { Favorites } from 'src/schemas/favorites.schema';
export declare class FavoritesService {
    private readonly favModel;
    private readonly eventModel;
    constructor(favModel: Model<Favorites>, eventModel: Model<Event>);
    addToFavorites(favoritesDto: FavoritesDto, req: any): Promise<{
        message: string;
    }>;
    removeFromFavourites(eventID: any, req: any): Promise<{
        message: string;
    }>;
    getFavourite(id: string, req: any): Promise<any[]>;
    getAllFavorites(offset: any, limit: any): Promise<{
        totalFavouriteEvents: number;
        data: any[];
    }>;
}
