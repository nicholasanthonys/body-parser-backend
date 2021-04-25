import { Schema, Document, model } from 'mongoose';
import { cLogicSchema, ICLogic } from './CLogic';
import { configureFileSerialSchema, IConfigureFileSerial } from './ConfigureFileSerial';
import { IFinalResponseConfig, finalResponseConfigSchema } from '../Response';


export interface ISerial extends Document {
    configures: Array<IConfigureFileSerial>
    next_failure: IFinalResponseConfig
    c_logics: Array<ICLogic>
}

export const serialSchema = new Schema({
    configures: {
        type: [configureFileSerialSchema],
        required: true,
        default: [],

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