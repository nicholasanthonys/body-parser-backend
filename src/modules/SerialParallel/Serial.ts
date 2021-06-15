import { Schema, Document, model } from 'mongoose';
import { configureFileSerialSchema, IConfigureFileSerial } from './ConfigureFileSerial';


export interface ISerial extends Document {
    configures: Array<IConfigureFileSerial>
}

export const serialSchema = new Schema({
    configures: {
        type: [configureFileSerialSchema.schema],
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