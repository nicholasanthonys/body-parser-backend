import { Schema, Document, model } from 'mongoose';
import {  cLogicSchema, ICLogic } from './CLogic';
import { configureFileSchema, IConfigureFile } from './ConfigureFile';
import { IFinalResponseConfig, finalResponseConfigSchema} from '../Response';


export interface ISerial extends Document {
    configures: Array<IConfigureFile>
    next_failure: IFinalResponseConfig
    c_logics: Array<ICLogic>
}

export const serialSchema = new Schema({
    configures: {
        type: [configureFileSchema],
        required: true,

    },
    next_failure: {
        type: finalResponseConfigSchema,
        required: true,
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

serialSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
    },
});
export const Serial = model<ISerial>('Serial', serialSchema);