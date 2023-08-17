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

  @Prop({default: '', required: true})
  startDate: number;

  @Prop({default: '', required: true})
  endDate: number;

  @Prop({default: '', required: true})
  location: string;

  @Prop({default: '', required: true})
  featuredImage: string;

  @Prop({ default: {}, required: false })
  gallery: Gallery;

  @Prop({default: false, required: false})
  deletedCheck: boolean;

  @Prop({default: 'upcoming', required: false})
  eventStatus: EventStatus

  @Prop({default: [], required: true})
  agenda: Agenda[];
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
  FINSIHED = 'finished'
}

export class Agenda {
  _id: string;
  day: number;
  title: string;
  from: string;
  to: string;
  venue: string;
  streamUrl: string;
  speaker?: Speaker
}

export class Speaker {
  _id: string;
  name: string;
  imageUrl: string
}