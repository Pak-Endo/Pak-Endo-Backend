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
export type SpeakerSchema = HydratedDocument<Event>;
export declare class Speaker extends Document {
    _id: string;
    speakerName: string;
    speakerContact: string;
    country: string;
    city: string;
    uniqueID: string;
    speakerImg: string;
    email: string;
    description: string;
    deletedCheck: false;
}
export declare const SpeakerSchema: import("mongoose").Schema<Speaker, import("mongoose").Model<Speaker, any, any, any, Document<unknown, any, Speaker> & Speaker & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Speaker, Document<unknown, {}, Speaker> & Speaker & Required<{
    _id: string;
}>>;
