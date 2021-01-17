import  { Schema, Document,model } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  date: Date
}


const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
    select:false
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


export const User  = model<IUser>('User',userSchema);
