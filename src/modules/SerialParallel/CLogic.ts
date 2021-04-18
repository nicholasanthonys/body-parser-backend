
import { Schema, Document, model, plugin } from 'mongoose';
import { IFinalResponseConfig } from '../Response';
import { finalResponseSchema } from '../Response'


export interface ICLogic extends Document {
    rule: Object
    data: Object | null;
    nextSuccess: string | null;
    response: IFinalResponseConfig
}

export const cLogicSchema = new Schema({
    rule: {
        type: Schema.Types.Mixed,
        required: true,
        default: {}

    },
    data: {
        type: Schema.Types.Mixed,
        required: false,
        default: null
    },
    next_success: {
        type: String,
        required: false,
        default: null
    },
    response: {
        type: finalResponseSchema,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

cLogicSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret._id;
        delete ret.__v;
    },
});
model<ICLogic>('cLogic', cLogicSchema);