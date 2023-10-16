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
import { HydratedDocument, Document } from 'mongoose';
export type UserSchema = HydratedDocument<User>;
export declare class User extends Document {
    _id: string;
    prefix: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    password: string;
    memberID: string;
    gender: Gender;
    city: string;
    qualifications: string;
    type: Type;
    status: Status;
    role: UserRole;
    deletedCheck: boolean;
    favorites: FavoriteInterface[];
    interested: InterestedInterface[];
    deviceToken: string;
    deviceId: string;
    isAndroid: boolean;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, User> & User & Required<{
    _id: string;
}>>;
export declare enum Type {
    E = "PES Executive Member",
    H = "PES Honorary Member",
    I = "International Executive Membership",
    S = "Scientific Members",
    SE = "Scientific Executive Members",
    N = "Non-Member"
}
export declare enum UserRole {
    ADMIN = "admin",
    MEMBER = "member"
}
export declare enum Status {
    APPROVED = 1,
    PENDING = 2,
    REJECTED = 3,
    BANNED = 4
}
export declare enum Gender {
    MALE = "Male",
    FEMALE = "Female",
    OTHER = "Other"
}
export interface FavoriteInterface {
    _id: string;
    userID: string;
    eventTitle: string;
    eventID: string;
}
export interface InterestedInterface {
    _id: string;
    userID: string;
    eventTitle: string;
    eventID: string;
}
