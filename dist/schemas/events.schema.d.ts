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
import { Gallery } from "./gallery.schema";
export type EventSchema = HydratedDocument<Event>;
export declare class Event extends Document {
    _id: string;
    title: string;
    description: string;
    startDate: number;
    endDate: number;
    location: sponsorType;
    featuredImage: string;
    gallery: Gallery;
    deletedCheck: boolean;
    eventStatus: EventStatus;
    agenda: AgendaInterface[];
    type: string;
    grandSponsor: any[];
    openForPublic: boolean;
    fees: any[];
    rating: number;
    isFavorite: boolean;
    isAttended: boolean;
}
export declare const EventSchema: import("mongoose").Schema<Event, import("mongoose").Model<Event, any, any, any, Document<unknown, any, Event> & Event & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Event, Document<unknown, {}, Event> & Event & Required<{
    _id: string;
}>>;
export declare enum EventStatus {
    ONGOING = "ongoing",
    UPCOMING = "upcoming",
    FINSIHED = "finished",
    DRAFT = "draft"
}
export interface sponsorType {
    id: string;
    name: string;
}
export interface AgendaInterface {
    _id: string;
    day: number;
    agendaTitle: string;
    from: string;
    to: string;
    venue: string;
    streamUrl?: string;
    speaker?: string;
    speakerImg?: string;
    attachments?: any[];
}
