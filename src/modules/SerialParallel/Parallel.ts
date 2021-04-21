import { Schema, Document, model } from 'mongoose';
import { finalResponseConfigSchema } from 'src/modules/Response';
import {  cLogicSchema, ICLogic } from './CLogic';
import { configureFileSchema, IConfigureFile } from './ConfigureFile';
import { IFinalResponseConfig } from '../Response';


export interface IParallel extends Document {
    configures: Array<IConfigureFile>
    next_failure: IFinalResponseConfig
    c_logics: Array<ICLogic>
}

export const parallelSchema = new Schema({
    configures: {
        type: [configureFileSchema],
        required: true,
    },
    next_failure: {
        type: finalResponseConfigSchema,
        required : true
    },
    c_logics: {
        type: [cLogicSchema],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

parallelSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
    },
});

export const Parallel = model<IParallel>('Parallel', parallelSchema);

