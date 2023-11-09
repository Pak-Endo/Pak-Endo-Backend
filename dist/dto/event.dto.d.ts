import { AgendaInterface, EventStatus, sponsorType } from "src/schemas/events.schema";
import { Gallery } from "src/schemas/gallery.schema";
export declare class EventDto {
    _id: string;
    title: string;
    description: string;
    startDate: Date | number;
    endDate: Date | number;
    featuredImage: string;
    gallery: Gallery;
    eventStatus: EventStatus;
    deletedCheck: boolean;
    streamUrl: string;
    location: sponsorType;
    type: string;
    grandSponsor: sponsorType;
    rating: number;
    openForPublic: boolean;
    grandSponsorContact: string;
    eventFeedback: string;
    agenda: AgendaInterface[];
}
