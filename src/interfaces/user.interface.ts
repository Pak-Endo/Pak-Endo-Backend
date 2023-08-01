/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface User extends Document {
  id?: string;
  prefix: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  deletedCheck: boolean;
  memberID: string;
  type: Type;
  phoneNumber: string;
}

export enum Type {
   PEM = 'PES Executive Member',
   PHM = 'PES Honorary Member',
   IEM = 'International Executive Membership',
   SM = 'Scientific Members',
   SEM = 'Scientific Executive Members'
}