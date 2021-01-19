import { Schema, Document, model } from 'mongoose';

export interface IFieldFinalResponse extends Document {
    header: Object,
    body: Object,
}

const fieldFinalResponseSchema = new Schema({
    header: Schema.Types.Mixed,
    body: Schema.Types.Mixed,
}, { strict: false, _id: false, id: false, });

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
    header: [String],
    body: [String],
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
    transform: String,
    log_before_modify: String,
    log_after_modify: String,
    adds: IFieldFinalResponse,
    modifies: IFieldFinalResponse,
    deletes: IFinalResponseDeleteField
}


 const finalResponseConfigSchema = new Schema({
    transform: {
        type: String,
        required: false
    },

    log_before_modify: {
        type: String,
        required: false,
        default: ""
    },
    log_after_modify: {
        type: String,
        required: false,
        default: ""
    },
    adds: fieldFinalResponseSchema,
    modifies: fieldFinalResponseSchema,
    delete: fieldFinalResponseDeleteSchema
}, { _id: false, id: false });

//* remove _id and _v from finalResponseConfigSchema when returning to JSON
finalResponseConfigSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});

export interface IFinalResponse extends Document {
    configureBased : String,
    response : IFinalResponseConfig
}

export const finalResponseSchema = new Schema({
    configure_based : String,
    response : finalResponseConfigSchema
},)

finalResponseSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
    },
});


export const FinalResponse = model<IFinalResponse>('FinalResponse', finalResponseSchema);
