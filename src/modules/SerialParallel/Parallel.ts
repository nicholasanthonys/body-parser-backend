import { Schema, Document, model } from 'mongoose';
import { finalResponseConfigSchema } from 'src/modules/Response';
import { cLogicSchema, ICLogic } from './CLogic';
import { configureFileParallelSchema, IConfigureFileParallel } from './ConfigureFileParallel';
import { IFinalResponseConfig } from '../Response';


export interface IParallel extends Document {
    configures: Array<IConfigureFileParallel>
    next_failure: IFinalResponseConfig
    c_logics: Array<ICLogic>
}

export const parallelSchema = new Schema({
    configures: {
        type: [configureFileParallelSchema],
        required: true,
        default: [],
    },
    next_failure: {
        type: finalResponseConfigSchema,
        required: true,
        default: {
            status_code: '',
            transform:
                "ToJson",

            log_before_modify: {},
            log_after_modify: {},
            adds: {
                header: {},
                body: {},
            },
            modifies: {
                header: {},
                body: {}
            },
            deletes: {
                header: [],
                body: [],
            }

        }
    },
    c_logics: {
        type: [cLogicSchema],
        required: true,
        default: [],
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

