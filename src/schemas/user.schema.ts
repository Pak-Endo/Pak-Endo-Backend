/* eslint-disable prettier/prettier */
import { HydratedDocument, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserSchema = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({default: ''})
  _id: string;

  @Prop({default: '', required: true})
  prefix: string;

  @Prop({default: '', required: true})
  firstName: string;

  @Prop({default: '', required: true})
  lastName: string;

  @Prop({default: '', required: true})
  email: string;

  @Prop({default: '', required: false})
  phoneNumber: string;

  @Prop({default: '', required: false})
  fullName: string;

  @Prop({default: '', required: true})
  password: string;

  @Prop({default: '', required: false})
  memberID: string;

  @Prop({default: '', required: true})
  gender: Gender;

  @Prop({default: '', required: true})
  city: string;

  @Prop({default: '', required: false})
  type: Type;

  @Prop({default: 2, required: false})
  status: Status;

  @Prop({default: '', required: false})
  role: UserRole;

  @Prop({default: false, required: false})
  deletedCheck: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('timestamps', true);
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});

UserSchema.pre<User>('save', async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  this.email = this.email.toLowerCase();
  next();
});

export enum Type {
  E = 'PES Executive Member',
  H = 'PES Honorary Member',
  I = 'International Executive Membership',
  S = 'Scientific Members',
  SE = 'Scientific Executive Members'
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}

export enum Status {
  APPROVED = 1,
  PENDING = 2,
  REJECTED = 3,
  BANNED = 4
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}