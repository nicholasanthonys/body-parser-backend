
import { Schema, Document, model } from 'mongoose';
import { IFinalResponseConfig } from '../Response';
import { finalResponseConfigSchema } from '../Response'


export interface ICLogic extends Document {
    rule: Object
    data: Object | null;
    next_success: string | null;
    response: IFinalResponseConfig | null,
    next_failure: string | null,
    failure_response: IFinalResponseConfig | null,
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
        default: null,
    },
    next_success: {
        type: String,
        required: false,
        default: null,
    },
    response: {
        type: finalResponseConfigSchema,
        default: null,
        required: false
    },
    next_failure: {
        type: String,
        required: false,
        default: null,
    },
    failure_response: {
        type: finalResponseConfigSchema,
        default: null,
        required: false
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
export const CLogic = model<ICLogic>('cLogic', cLogicSchema);