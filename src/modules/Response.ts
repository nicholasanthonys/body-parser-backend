import { Schema, Document, model } from 'mongoose';

export interface IFieldFinalResponse extends Document {
    header: Object,
    body: Object,
}

const fieldFinalResponseSchema = new Schema({
    header: {
        type: Schema.Types.Mixed,
        default: {}
    },
    body: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, {  _id: false, id: false, });

//* Remove _Id and _v from fieldSchema when returning to JSON
fieldFinalResponseSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
    },
});

export interface IFinalResponseDeleteField extends Document {
    header: Array<string>
    body: Array<string>,
}

const fieldFinalResponseDeleteSchema = new Schema({
    header: [String],
    body: [String],
}, { _id: false, id: false });

//* Remove _Id and _v from fieldDeleteSchema when returning to JSON
fieldFinalResponseDeleteSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});




export interface IFinalResponseConfig extends Document {
    status_code: number,
    transform: string,
    log_before_modify: Object ,
    log_after_modify: Object ,
    adds: IFieldFinalResponse,
    modifies: IFieldFinalResponse,
    deletes: IFinalResponseDeleteField
}


export const finalResponseConfigSchema = new Schema({
    status_code: {
        type: Number,
        required: true,
        default : 0,
    },
    transform: {
        type: String,
        required:true,
        default : "ToJson" 
    },

    log_before_modify: {
        type: Object,
        required: true,
        default: {}
    },
    log_after_modify: {
        type: Object,
        required: true,
        default:{} 
    },
    adds: {
        type: fieldFinalResponseSchema,
        required : true,
        default: {
            header : {},
            body : {},
        },
    },
    modifies: {
        type: fieldFinalResponseSchema,
        required : true,
        default: {
            header : {},
            body : {}
        }
    },
    deletes: {
        type: fieldFinalResponseSchema,
        required : true,
        default: {
            header : [],
            body : [],
        },
    }
}, { _id: false, id: false });

//* remove _id and _v from finalResponseConfigSchema when returning to JSON
finalResponseConfigSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});




export const FinalResponse = model<IFinalResponseConfig>('FinalResponse', finalResponseConfigSchema);
