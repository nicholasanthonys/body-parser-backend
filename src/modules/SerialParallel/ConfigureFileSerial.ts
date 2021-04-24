import { Schema, Document, model } from 'mongoose';
import { cLogicSchema,ICLogic } from './CLogic';
import { finalResponseConfigSchema,IFinalResponseConfig} from '../Response';


export interface IConfigureFileSerial extends Document {
    file_name: String
    alias: String
    cLogics : Array<ICLogic>
    nextFailure : IFinalResponseConfig
}

export const configureFileSerialSchema = new Schema({
    file_name: {
        type: Schema.Types.String,
        required: true,
    },
    alias: {
        type: Schema.Types.String,
        required: true,
    },
    c_logics : {
        type : [cLogicSchema],
        required : true,
        default : [],
    },
    next_failure : {
        type : finalResponseConfigSchema,
        required : true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

configureFileSerialSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret._id;
        delete ret.__v;
    },
});
export const ConfigureFileSerial = model<IConfigureFileSerial>('configureFileSerial', configureFileSerialSchema);