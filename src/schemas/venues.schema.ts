import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type VenueSchema = HydratedDocument<Event>;

@Schema()
export class Venue extends Document {
  @Prop({default: ''})
  _id: string;

  @Prop({default: '', required: true})
  city: string

  @Prop({default: '', required: true})
  venueName: string;

  @Prop({default: [], required: true})
  halls: string[]

  @Prop({default: false, required: false})
  deletedCheck: false
}

export const VenueSchema = SchemaFactory.createForClass(Venue);

VenueSchema.set('timestamps', true);
VenueSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});