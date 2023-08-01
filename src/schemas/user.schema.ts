/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/interfaces/user.interface';

export const UserSchema = new mongoose.Schema(
    {
      _id: { type: String, default: '' },
      username: { type: String, default: ''},
      email: { type: String, default: '' },
      password: { type: String, default: '' },
      memberID: { type: String, defualt: '' },
      deletedCheck: { type: Boolean, default: false }
    },
    {
      collection: 'User',
    }
);

UserSchema.set('timestamps', true);
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});

UserSchema.pre<User>('save',async function(next){
  const salt=await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  this.email = this.email.toLowerCase();

  next();
});