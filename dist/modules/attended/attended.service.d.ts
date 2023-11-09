import { Model } from 'mongoose';
import { AttendedDto } from 'src/dto/attended.dto';
import { Event } from 'src/schemas/events.schema';
import { Attended } from 'src/schemas/interested.schema';
export declare class AttendedService {
    private readonly attendModel;
    private readonly eventModel;
    constructor(attendModel: Model<Attended>, eventModel: Model<Event>);
    addToAttended(AttendedDto: AttendedDto, req: any): Promise<{
        message: string;
    }>;
    getAttended(id: string, req: any): Promise<any>;
    getAllAttended(offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    deleteAllAttended(): Promise<import("mongodb").DeleteResult>;
}
