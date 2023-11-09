import { Model } from 'mongoose';
import { Event } from 'src/schemas/events.schema';
import { User } from 'src/schemas/user.schema';
export declare class CronjobsService {
    private readonly eventModel;
    private readonly userModel;
    constructor(eventModel: Model<Event>, userModel: Model<User>);
    startCronJobForEventStatus(): Promise<void>;
    endCronJobForEventStatus(): Promise<void>;
    startCronJobToNotifyUpcomingEvent(): Promise<void>;
}
