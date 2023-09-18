import { FavoritesService } from './favorites.service';
import { FavoritesDto } from 'src/dto/favorites.dto';
export declare class FavoritesController {
    private readonly favService;
    constructor(favService: FavoritesService);
    getFavorites(limit: number, offset: number, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getFavById(id: string, req: any): Promise<any[]>;
    addToFavs(favoritesDto: FavoritesDto, req: any): Promise<{
        message: string;
    }>;
    removeFromFavourites(eventID: string, req: any): Promise<{
        message: string;
    }>;
}
