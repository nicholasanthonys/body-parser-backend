import { Schema, Document, model, plugin } from 'mongoose';
import { IUser } from './User';
import {configureSchema,IConfigure} from './Configure';
import {finalResponseSchema} from './Response'




export interface IProject extends Document {
    _id: string;
    userId: IUser['_id']
    name: string;
    description: string;
    date: Date,
    configures : Array<IConfigure>
}

const projectSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        select: false

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
    configures :{
        type : [configureSchema],
        default : [],
        required : false,
    },
    finalResponse : {
        type : finalResponseSchema,
        default : null,
        required : false
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

projectSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});

export const Project = model<IProject>('Project', projectSchema);
Object.seal(Project);