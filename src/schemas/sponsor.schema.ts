import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type SponsorSchema = HydratedDocument<Event>;

@Schema()
export class Sponsor extends Document {
  @Prop({default: ''})
  _id: string;

  @Prop({default: '', required: true})
  sponsorName: string;

  @Prop({default: '', required: false})
  sponsorCategory: string;

  @Prop({default: '', required: false})
  sponsorEmail: string;

  @Prop({default: '', required: false})
  contactPerson: string;

  @Prop({default: '', required: false})
  uniqueID: string;

  @Prop({default: '', required: false})
  sponsorLogo: string;

  @Prop({default: '', required: false})
  description: string;

  @Prop({default: false, required: false})
  deletedCheck: false

  @Prop({default: '', required: false})
  contact: string
}

export const SponsorSchema = SchemaFactory.createForClass(Sponsor);

SponsorSchema.set('timestamps', true);
SponsorSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});