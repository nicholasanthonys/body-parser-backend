
import { Schema, Document, model } from 'mongoose';
import { finalResponseConfigSchema } from 'src/modules/Response';
import { IFinalResponseConfig } from '../Response';


export interface IBase extends Document {
    project_max_circular: Number
    circular_response: IFinalResponseConfig
}

export const baseSchema = new Schema({
    project_max_circular: {
        type: Schema.Types.Number,
        default: 10,
        required: true

    },
    circular_response: {
        type: finalResponseConfigSchema,
        required: true,
        default: {
            status_code: 508,
            transform: "ToJson",
            log_before_modify: {},
            log_after_modify: {},
            adds: {
                body: {
                    message: "Circular Request"
                },
            },
            modifies: {
            },
            deletes: {
            }
        }
    },

    date: {
        type: Date,
        default: Date.now,
    },
});

baseSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});
model<IBase>('baseOption', baseSchema);