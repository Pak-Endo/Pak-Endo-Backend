import { Model } from 'mongoose';
import { Event } from 'src/schemas/events.schema';
import { EventDto } from 'src/dto/event.dto';
import { Gallery } from 'src/schemas/gallery.schema';
export declare class EventsService {
    private readonly eventModel;
    private readonly galleryModel;
    constructor(eventModel: Model<Event>, galleryModel: Model<Gallery>);
    getAllEvents(limit: number, offset: number, title?: string): Promise<any>;
    getUpcomingEvents(limit: number, offset: number, title?: string): Promise<any>;
    getOnGoingEvents(limit: number, offset: number, title?: string): Promise<any>;
    getFinishedEvents(limit: number, offset: number, title?: string): Promise<any>;
    createNewEvent(eventDto: EventDto): Promise<any>;
    updateEvent(eventDto: EventDto, eventID: string): Promise<any>;
    deleteEvent(eventID: string): Promise<any>;
    getEventStats(): Promise<any>;
    getUpcomingEventsForCalendar(limit: number, offset: number): Promise<any>;
}
