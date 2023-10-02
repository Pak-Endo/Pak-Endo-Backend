import { EventsService } from './events.service';
import { EventDto } from 'src/dto/event.dto';
export declare class EventsController {
    private readonly eventService;
    constructor(eventService: EventsService);
    postNewEvent(eventDto: EventDto): Promise<any>;
    updateEventData(eventDto: EventDto, eventID: string): Promise<any>;
    deleteEventByID(eventID: string): Promise<any>;
    fetchAllEvents(limit: number, offset: number, userID?: string, title?: string, location?: string, type?: string, startDate?: number, endDate?: number, speaker?: string, status?: string): Promise<any>;
    fetchAllEventsByCategory(limit: number, offset: number, userID?: string): Promise<any>;
    fetchUpcomingEvents(limit: number, offset: number, title?: string, userID?: string): Promise<any>;
    fetchOnGoingEvents(limit: number, offset: number, title?: string, userID?: string): Promise<any>;
    fetchFinishedEvents(limit: number, offset: number, title?: string, userID?: string): Promise<any>;
    fetchEventStats(): Promise<any>;
    fetchEventsForCalendar(limit: number, offset: number): Promise<any>;
    fetchEventByID(eventID: string, speakerName: string, hallName: string, startTime: string): Promise<any>;
    deleteAllEvents(): Promise<import("mongodb").DeleteResult>;
}
