import { Schema, Document, model, plugin } from 'mongoose';
import {IUser} from './User';

export interface IPort extends Document {
    _id: string;
    port : String
    containerId : String | null,
    userId: IUser['_id'] | null,
    description : String | null,
    date: Date,
 
}

const portSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    port: {
        type: String,
        required : true,
        unique : true,
    },
    containerId : {
        type: Schema.Types.ObjectId,
        required: false,
    },
    description: { 
        type: String, 
        required : false
    },

    date: {
        type: Date,
        default: Date.now,
    },
});


export const Port = model<IPort>('Port', portSchema);
Object.seal(Port);