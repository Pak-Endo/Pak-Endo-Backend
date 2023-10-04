import { VenueService } from './venues.service';
import { VenueDto } from 'src/dto/venue.dto';
export declare class VenueController {
    private readonly venueService;
    constructor(venueService: VenueService);
    postNewVenue(venueDto: VenueDto): Promise<any>;
    updateVenueData(venueDto: VenueDto, venueID: string): Promise<any>;
    deleteVenueByID(venueID: string): Promise<any>;
    fetchAllVenues(limit: number, offset: number, venueName?: string): Promise<any>;
    fetchVenueByID(sponsorID: string): Promise<any>;
    deleteAllVenues(): Promise<import("mongodb").DeleteResult>;
}
