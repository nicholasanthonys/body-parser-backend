import { Schema, Document, model  } from 'mongoose';
import { IUser } from '../User';
import {configureSchema,IConfigure} from '../Configure/Configure';
import { ISerial, serialSchema } from '../SerialParallel/Serial';
import { parallelSchema, IParallel } from '../SerialParallel/Parallel';
import {baseSchema, IBase} from '../SerialParallel/Base'



export interface IProject extends Document {
    _id: string;
    userId: IUser['_id']
    name: string;
    description: string;
    date: Date,
    configures : IConfigure,
    serial : ISerial | null ,
    parallel : IParallel | null,
    base : IBase
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
        type : configureSchema,
        default : {
            description : ''
        },
        required : false,
    },
    serial : {
        type : serialSchema,
        default : null,
        required : false
    },
    parallel : {
        type : parallelSchema,
        default : null,
        required : false
    },
    base : {
        type : baseSchema,
        required : true
    },
    date: {
        type: Date,
        default: Date.now,
    },
}  );

projectSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});

export const Project = model<IProject>('Project', projectSchema);