import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type SpeakerSchema = HydratedDocument<Event>;

@Schema()
export class Speaker extends Document {
  @Prop({default: ''})
  _id: string;

  @Prop({default: '', required: true})
  speakerName: string;

  @Prop({default: '', required: true})
  speakerContact: string;

  @Prop({default: '', required: true})
  country: string;

  @Prop({default: '', required: true})
  city: string;

  @Prop({default: '', required: true})
  uniqueID: string;

  @Prop({default: '', required: false})
  speakerImg: string;

  @Prop({default: '', required: true})
  email: string;

  @Prop({default: '', required: true})
  description: string;

  @Prop({default: false, required: false})
  deletedCheck: false
}

export const SpeakerSchema = SchemaFactory.createForClass(Speaker);

SpeakerSchema.set('timestamps', true);
SpeakerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});