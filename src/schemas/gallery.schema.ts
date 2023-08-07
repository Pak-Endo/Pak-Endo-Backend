import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type GallerySchema = HydratedDocument<Gallery>;

@Schema()
export class Gallery extends Document {
  @Prop({default: '', required: false})
  _id: string;

  @Prop({default: '', required: false})
  eventID: string;

  @Prop({default: [], required: true})
  mediaUrl: string[];
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);

GallerySchema.set('timestamps', true);
GallerySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});