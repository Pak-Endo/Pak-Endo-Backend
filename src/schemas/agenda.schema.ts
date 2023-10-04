import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type AgendaSchema = HydratedDocument<Event>;

@Schema()
export class Agenda extends Document {
  @Prop({default: ''})
  _id: string;

  @Prop({default: '', required: true})
  agendaTitle: string;

  @Prop({default: '', required: false})
  theme: string;

  @Prop({default: '', required: false})
  sponsor: string;

  @Prop({default: 0, required: true})
  day: number;

  @Prop({default: '', required: true})
  from: string;

  @Prop({default: '', required: true})
  to: string;

  @Prop({default: '', required: false})
  hall: string;

  @Prop({default: '', required: false})
  speaker: string;

  @Prop({default: '', required: false})
  speakerDesignation: string;

  @Prop({default: [], required: false})
  speakerTeam: any[];

  @Prop({default: '', required: false})
  streamUrl: string;

  @Prop({default: false, required: false})
  deletedCheck: boolean;

  @Prop({default: '', required: false})
  speakerImg: string;

  @Prop({default: [], required: false})
  attachments: any[];
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