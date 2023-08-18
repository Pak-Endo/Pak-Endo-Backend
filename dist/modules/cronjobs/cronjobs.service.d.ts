import { Model } from 'mongoose';
import { Event } from 'src/schemas/events.schema';
export declare class CronjobsService {
    private readonly eventModel;
    constructor(eventModel: Model<Event>);
    startCronJobForEventStatus(): Promise<void>;
    endCronJobForEventStatus(): Promise<void>;
}
