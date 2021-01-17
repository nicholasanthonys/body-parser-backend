import { Schema, Document, model } from 'mongoose';
import { IUser } from './User';

export interface IProject extends Document {
    _id: string;
    userId : IUser['_id']
    name: string;
    description: string;
    date: Date
}

const projectShema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    description: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


export const Project = model<IProject>('Project', projectShema);
Object.seal(Project);