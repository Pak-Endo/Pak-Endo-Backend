import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Speaker } from "./events.schema";

export type AgendaSchema = HydratedDocument<Event>;

@Schema()
export class Agenda extends Document {
  @Prop({default: ''})
  _id: string;

  @Prop({default: '', required: true})
  title: string;

  @Prop({default: '', required: true})
  day: string;

  @Prop({default: '', required: true})
  from: number;

  @Prop({default: '', required: true})
  to: number;

  @Prop({default: '', required: true})
  venue: string;

  @Prop({default: '', required: true})
  speaker: Speaker;

  @Prop({default: '', required: true})
  streamUrl: string;

  @Prop({default: false, required: false})
  deletedCheck: boolean;
}

export const AgendaSchema = SchemaFactory.createForClass(Agenda);

AgendaSchema.set('timestamps', true);
AgendaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});