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
export type AgendaSchema = HydratedDocument<Event>;
export declare class Agenda extends Document {
    _id: string;
    agendaTitle: string;
    day: number;
    from: string;
    to: string;
    venue: string;
    speaker: string;
    streamUrl: string;
    deletedCheck: boolean;
    speakerImg: string;
    attachments: any[];
}
export declare const AgendaSchema: import("mongoose").Schema<Agenda, import("mongoose").Model<Agenda, any, any, any, Document<unknown, any, Agenda> & Agenda & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Agenda, Document<unknown, {}, Agenda> & Agenda & Required<{
    _id: string;
}>>;
