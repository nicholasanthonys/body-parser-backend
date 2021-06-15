import { Schema, Document, model } from 'mongoose';
import { cLogicSchema,ICLogic } from './CLogic';
import { finalResponseConfigSchema,IFinalResponseConfig} from '../Response';
import {ConfigureFile, IConfigureFile} from "src/modules/SerialParallel/ConfigureFile";


export interface IConfigureFileSerial extends IConfigureFile,  Document {
    c_logics : Array<ICLogic>
    failure_response : IFinalResponseConfig
}

export const configureFileSerialSchema = ConfigureFile.discriminator('ConfigureFileSerial', new Schema({
    c_logics : {
        type : [cLogicSchema],
        required : true,
        default : [],
    },
    failure_response : {
        type : finalResponseConfigSchema,
        required : true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})  );

configureFileSerialSchema.schema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret._id;
        delete ret.__v;
    },
});



export const ConfigureFileSerial = model<IConfigureFileSerial>('ConfigureFileSerial' );