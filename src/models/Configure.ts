import { Schema, Document, model } from 'mongoose';
import { IProject } from './Project';



export interface IField extends Document {
    param: Object,
    header: Object,
    body: Object,
    query: Object,
}

const fieldSchema  = new Schema({
    param : Schema.Types.Mixed,
    header: Schema.Types.Mixed,
    body: Schema.Types.Mixed,
    query: Schema.Types.Mixed
}, {strict : false, _id : false, id :false});

//* Remove _Id and _v from fieldSchema when returning to JSON
fieldSchema.set('toJSON', {
    virtuals: true,
    transform: (doc : any, ret : any, options : any) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
    },
});

export interface IDeleteField  extends Document {
    param: [String]
    header: [String],
    body: [String],
    query: [String],
}

const fieldDeleteSchema  = new Schema({
    param : [String],
    header:[String],
    body: [String],
    query: [String]
} ,{_id : false, id :false});

//* Remove _Id and _v from fieldDeleteSchema when returning to JSON
fieldDeleteSchema.set('toJSON', {
    virtuals: true,
    transform: (doc : any, ret : any, options : any) => {
        delete ret.__v;
     
        delete ret._id;
    },
});


export interface ICommand  extends Document{
    destination_url: String,
    destination_path: String,
    method: String,
    transform: String,
    log_before_modify: String,
    log_after_modify: String,
    adds: IField,
    modifies: IField,
    deletes : IDeleteField
}

const commandSchema = new Schema({
    destination_url: {
        type: String,
        required: false,
    },
    destination_path : {
        type : String,
        required : false
    },
    
    method : {
        type : String,
        required : false
    },
    
    transform : {
        type : String,
        required : false
    },
    
    log_before_modify : {
        type : String,
        required : false,
        default : ""
    },
    log_after_modify : {
        type : String,
        required : false,
        default : ""
    },
    adds : fieldSchema,
    modifies : fieldSchema,
    delete : fieldDeleteSchema
},{_id : false, id :false});

//* remove _id and _v from commandSchema when returning to JSON
commandSchema.set('toJSON', {
    virtuals: true,
    transform: (doc : any, ret : any, options : any) => {
        delete ret.__v;
        delete ret._id;
    },
});



export interface IConfig extends Document {
    Request: ICommand,
    Response: ICommand
}

const configSchema = new Schema({
    request: {
        type: commandSchema,
        required: true
    },
    response: {
        type: commandSchema,
        required: true,
    },
});

//* Remove id and _v when returning to JSON
configSchema.set('toJSON', {
    virtuals: true,
    transform: (doc : any, ret : any, options : any) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
    },
});

export interface IConfigure extends Document {
    _id: string;
    projectId: IProject['_id']
    config: IConfig
    description: String,

}


export const configureSchema = new Schema({
    config: {
        type: configSchema,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export const Configure = model<IConfigure>('Configure', configureSchema);
