import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema() 
export class Favorites extends Document {
    @Prop({default: ''})
    _id: string;

    @Prop({default: ''})
    eventID: string;

    @Prop({ default: ''})
    userID: string;

    @Prop({default: false})
    deletedCheck: boolean
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorites)

FavoriteSchema.set('timestamps', true);
FavoriteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});