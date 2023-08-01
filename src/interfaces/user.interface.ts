/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface User extends Document {
  id?: string;
  email: string;
  username: string;
  password: string;
  deletedCheck: boolean;
  memberID: string;
}