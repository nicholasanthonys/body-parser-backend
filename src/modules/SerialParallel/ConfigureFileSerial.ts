import { Schema, Document, model } from 'mongoose';
import { cLogicSchema,ICLogic } from './CLogic';
import { finalResponseConfigSchema,IFinalResponseConfig} from '../Response';


export interface IConfigureFileSerial extends Document {
    configure_id: string
    alias: string
    c_logics : Array<ICLogic>
    next_failure : IFinalResponseConfig
}

export const configureFileSerialSchema = new Schema({
    configure_id: {
        type: Schema.Types.String,
        required: true,
        default : ''
    },
    alias: {
        type: Schema.Types.String,
        required: true,
        default : '',
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