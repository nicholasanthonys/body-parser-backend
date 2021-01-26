import { Schema, Document, model } from 'mongoose';

export interface IRouterModel extends Document {
    _id: string;
    path : string
    project_directory: string,
    type: string;
    method: string;
    date: Date,
 
}

export const routerSchema = new Schema({
    path: {
        type: String,
        required: true,

    },
    project_directory: {
        type: String,
        required : true,
    },
    type: { 
        type: String, 
        default : "serial"
    },
    method: {
        type: String,
        required: true
    },
});


export const RouterModel = model<IRouterModel>('RouterModel', routerSchema);
