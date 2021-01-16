import  { Schema, Document,Model,model } from 'mongoose';

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
    hidden: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});



export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  date: Date
}


export const User  = model<IUser>('User',userSchema);


// module.exports = mongoose.model<IUser>("User", userSchema);