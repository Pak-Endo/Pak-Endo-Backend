import { SponsorService } from './sponsors.service';
import { SponsorDto } from 'src/dto/sponsor.dto';
export declare class SponsorController {
    private readonly sponsorService;
    constructor(sponsorService: SponsorService);
    postNewSponsor(sponsorDto: SponsorDto): Promise<any>;
    updateSponsorData(sponsorDto: SponsorDto, sponsorID: string): Promise<any>;
    deleteSponsorByID(sponsorID: string): Promise<any>;
    fetchAllSponsors(limit: number, offset: number, sponsorName?: string): Promise<any>;
    fetchSponsorByID(sponsorID: string): Promise<any>;
    deleteAllSponsors(): Promise<import("mongodb").DeleteResult>;
}
