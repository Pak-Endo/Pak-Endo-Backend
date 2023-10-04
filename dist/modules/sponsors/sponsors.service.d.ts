import { Model } from "mongoose";
import { Sponsor } from "src/schemas/sponsor.schema";
import { SponsorDto } from "src/dto/sponsor.dto";
export declare class SponsorService {
    private readonly sponsorModel;
    constructor(sponsorModel: Model<Sponsor>);
    getAllSponsors(limit: number, offset: number, sponsorName?: string): Promise<any>;
    getSponsorById(sponsorID: string): Promise<any>;
    addNewSponsor(sponsor: SponsorDto): Promise<any>;
    updateSponsor(sponsorID: string, sponsorData: SponsorDto): Promise<any>;
    deleteSponsor(sponsorID: string): Promise<any>;
    deleteAllSponsors(): Promise<import("mongodb").DeleteResult>;
}
