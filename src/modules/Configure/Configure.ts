import { Schema, Document, model } from 'mongoose';
import { IProject } from '../Project/Project';



export interface IField extends Document {
    param: Object,
    header: Object,
    body: Object,
    query: Object,
}

const fieldSchema = new Schema({
    param: Schema.Types.Mixed,
    header: Schema.Types.Mixed,
    body: Schema.Types.Mixed,
    query: Schema.Types.Mixed
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


export interface ICommand extends Document {
    transform: String,
    log_before_modify: Object ,
    log_after_modify: Object ,
    adds: IField,
    modifies: IField,
    deletes: IDeleteField
}

export interface ICommandRequest extends ICommand {
    destination_url: string,
    destination_path: string | null,
    method: string,
    transform: string,
    log_before_modify: Object ,
    log_after_modify: Object ,
    adds: IField,
    modifies: IField,
    deletes: IDeleteField
}



export const commandSchema = new Schema({
    destination_url: {
        type: String,
        required: false,
    },
    destination_path: {
        type: String,
        required: false
    },

    method: {
        type: String,
        required: false
    },

    transform: {
        type: Object,
        required: false,
        default : {}
    },

    log_before_modify: {
        type: Object,
        required: false,
        default: {}
    },
    log_after_modify: {
        type: String,
        required: false,
        default: ""
    },
    adds: fieldSchema,
    modifies: fieldSchema,
    deletes: fieldDeleteSchema
}, { _id: false, id: false });

//* remove _id and _v from commandSchema when returning to JSON
commandSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});



export interface IConfig extends Document {
    request: ICommandRequest,
    response: ICommand
}

const configSchema = new Schema({
    request: {
        type: commandSchema,
        required: false
    },
    response: {
        type: commandSchema,
        required: true,
    },
}, { strict: true });

//* Remove id and _v when returning to JSON
configSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
    },
});

export interface IConfigure extends Document {
    _id: string;
    configs: Array<IConfig>
    description: String,

}


export const configureSchema = new Schema({
    configs: {
        type: [configSchema],
        default : [],
        required: true,
    },
    description: {
        type: String,
        default : null,
        required: false
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