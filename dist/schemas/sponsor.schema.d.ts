/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document, HydratedDocument } from "mongoose";
export type SponsorSchema = HydratedDocument<Event>;
export declare class Sponsor extends Document {
    _id: string;
    sponsorName: string;
    sponsorCategory: string;
    sponsorEmail: string;
    contactPerson: string;
    uniqueID: string;
    sponsorLogo: string;
    description: string;
    deletedCheck: false;
    contact: string;
}
export declare const SponsorSchema: import("mongoose").Schema<Sponsor, import("mongoose").Model<Sponsor, any, any, any, Document<unknown, any, Sponsor> & Sponsor & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Sponsor, Document<unknown, {}, Sponsor> & Sponsor & Required<{
    _id: string;
}>>;
