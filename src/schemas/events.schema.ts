import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import { Gallery } from "./gallery.schema";

export type EventSchema = HydratedDocument<Event>;

@Schema()
export class Event extends Document {
  @Prop({default: ''})
  _id: string;

  @Prop({default: '', required: true})
  title: string;

  @Prop({default: '', required: true})
  description: string;

  @Prop({default: 0, required: true})
  startDate: number;

  @Prop({default: 0, required: true})
  endDate: number;

  @Prop({type: 'object', default: {}, required: true})
  location: sponsorType;

  @Prop({default: '', required: true})
  featuredImage: string;

  @Prop({ default: {}, required: false })
  gallery: Gallery;

  @Prop({default: false, required: false})
  deletedCheck: boolean;

  @Prop({default: 'upcoming', required: false})
  eventStatus: EventStatus

  @Prop({default: [], required: true})
  agenda: AgendaInterface[];

  @Prop({default: '', required: true})
  type: string;

  @Prop({type: [], default: {}, required: false})
  grandSponsor: any[];

  @Prop({default: false, required: true})
  openForPublic: boolean;

  @Prop({default: [], required: false})
  fees: any[];

  @Prop({default: '', required: false})
  rating: number;

  @Prop({default: '', required: false})
  contactNumber: number;
  
  @Prop({default: '', required: false})
  contactPerson: string;

  @Prop({default: false, required: false})
  isFavorite: boolean;

  @Prop({default: false, required: false})
  isAttended: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.set('timestamps', true);
EventSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});

export enum EventStatus {
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
  FINSIHED = 'finished',
  DRAFT = 'draft'
}

export interface sponsorType {
  id: string,
  name: string
}

export interface AgendaInterface {
  _id: string;
  day: number;
  agendaTitle: string;
  from: string;
  to: string;
  venue: string;
  streamUrl?: string;
  speaker?: string,
  speakerImg?: string;
  attachments?: any[];
}