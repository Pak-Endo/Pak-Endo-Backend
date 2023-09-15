import { Model } from 'mongoose';
import { Event } from 'src/schemas/events.schema';
import { EventDto } from 'src/dto/event.dto';
import { Gallery } from 'src/schemas/gallery.schema';
import { Agenda } from 'src/schemas/agenda.schema';
export declare class EventsService {
    private readonly eventModel;
    private readonly galleryModel;
    private readonly agendaModel;
    constructor(eventModel: Model<Event>, galleryModel: Model<Gallery>, agendaModel: Model<Agenda>);
    getAllEvents(limit: number, offset: number, userID?: string, title?: string, location?: string, type?: string, startDate?: number, endDate?: number, speaker?: string): Promise<any>;
    getAllEventsByCategory(limit: number, offset: number): Promise<any>;
    getUpcomingEvents(limit: number, offset: number, title?: string): Promise<any>;
    getOnGoingEvents(limit: number, offset: number, title?: string): Promise<any>;
    getFinishedEvents(limit: number, offset: number, title?: string): Promise<any>;
    createNewEvent(eventDto: EventDto): Promise<any>;
    updateEvent(eventDto: EventDto, eventID: string): Promise<any>;
    getEventByID(eventID: string): Promise<any>;
    deleteEvent(eventID: string): Promise<any>;
    getEventStats(): Promise<any>;
    getUpcomingEventsForCalendar(limit: number, offset: number): Promise<any>;
}
