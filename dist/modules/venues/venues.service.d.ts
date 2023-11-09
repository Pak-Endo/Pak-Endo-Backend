import { Model } from "mongoose";
import { Venue } from "src/schemas/venues.schema";
import { VenueDto } from "src/dto/venue.dto";
export declare class VenueService {
    private readonly venueModel;
    constructor(venueModel: Model<Venue>);
    getAllVenues(limit: number, offset: number, venueName?: string): Promise<any>;
    getVenueById(venueID: string): Promise<any>;
    addNewVenue(venue: VenueDto): Promise<any>;
    updateVenue(venueID: string, venueData: VenueDto): Promise<any>;
    deleteVenue(venueID: string): Promise<any>;
    deleteAllVenues(): Promise<import("mongodb").DeleteResult>;
}
