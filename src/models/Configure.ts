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
}, {strict : false});



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


export interface IConfigure extends Document {
    _id: string;
    projectId: IProject['_id']
    config: IConfig
    description: String,

}


const configureSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true
    },
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
