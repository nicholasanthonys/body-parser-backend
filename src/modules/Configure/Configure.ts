import { Schema, Document, model } from 'mongoose';
import { IProject } from '../Project/Project';
import { finalResponseConfigSchema, IFinalResponseConfig } from '../Response';



export interface IField extends Document {
    param: Object,
    header: Object,
    body: Object,
    query: Object,
}

const fieldSchema = new Schema({
    param: {
        type: Schema.Types.Mixed,
        default: {},
    },
    header: {
        type: Schema.Types.Mixed,
        default: {},
    },
    body: {
        type: Schema.Types.Mixed,
        default: {},
    },
    query: {
        type: Schema.Types.Mixed,
        default: {},
    },
}, { strict: false, _id: false, id: false });

//* Remove _Id and _v from fieldSchema when returning to JSON
fieldSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
    },
});

export interface IDeleteField extends Document {
    header: Array<string>
    body: Array<string>
    query: Array<string>
}

const fieldDeleteSchema = new Schema({
    header: [String],
    body: [String],
    query: [String]
}, { _id: false, id: false });

//* Remove _Id and _v from fieldDeleteSchema when returning to JSON
fieldDeleteSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});

export interface ICommandRequest extends Document {
    destination_url: string,
    destination_path: string | null,
    method: string,
    transform: string,
    log_before_modify: Object,
    log_after_modify: Object,
    adds: IField,
    modifies: IField,
    deletes: IDeleteField
}



export const requestConfigSchema = new Schema({
    destination_url: {
        type: String,
        required: true,
    },
    destination_path: {
        type: String,
        required: false,
        default: ''
    },

    method: {
        type: String,
        required: true
    },

    transform: {
        type: Object,
        required: true,
        default: "ToJson"
    },

    log_before_modify: {
        type: Object,
        required: true,
        default: {}
    },
    log_after_modify: {
        type: Object,
        required: true,
        default: {}
    },
    adds: {
        type: fieldSchema,
        required: true,
        default: {
            // param: {
            // },
            header: {
            },
            body: {
            },
            query: {
            },
        }
    },
    modifies: {
        type: fieldSchema,
        required: true,
        default: {
            // param: {
            // },
            header: {
            },
            body: {
            },
            query: {
            },
        }
    },
    deletes: {
        type :  fieldDeleteSchema,
        default : {
            header : [],
            body : [],
            query : [],
        
        }
    }
}, { _id: false, id: false });

//* remove _id and _v from commandSchema when returning to JSON
requestConfigSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});



export interface IConfig extends Document {
    description: String,
    request: ICommandRequest,
    response: IFinalResponseConfig
}

const configSchema = new Schema({
    description: {
        type: Schema.Types.String,
        required: false,
        default: ''
    },
    request: {
        type: requestConfigSchema,
        required: true,

    },
    response: {
        type: finalResponseConfigSchema,
        required: true,
    },
}, { strict: true });

//* Remove id and _v when returning to JSON
configSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});

export interface IConfigure extends Document {
    _id: string;
    configs: Array<IConfig>

}


export const configureSchema = new Schema({
    configs: {
        type: [configSchema],
        default: [],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

configureSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
        delete ret.date;
    },
})

export const Configure = model<IConfigure>('Configure', configureSchema);
export const Config = model<IConfig>('Config', configSchema);