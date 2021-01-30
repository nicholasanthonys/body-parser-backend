import { Schema, Document, model } from 'mongoose';
import {IUser} from './User';
import {IProject} from './Project';
import {IRouterModel, routerSchema} from './RouterModel';
import { boolean } from 'joi';



export interface IContainer extends Document {
    _id: string;
    userId : IUser['_id']
    containerId: string,
    name: string;
    status : string,
    description: string;
    projectIds :Array<IProject['_id']>
    routers: [IRouterModel],
    isContainerCreated : Boolean
    date: Date,
 
}



const containerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    containerId: {
        type: String,
        required : false,
        default : null
    },
    name: { 
        type: String,
        required : true, 
    },
    status: { 
        type: String, 
        default : "stopped",
    },
    description: {
        type: String,
        required: false
    },
    projectIds : {
        type : [Schema.Types.ObjectId]
    },
    routers : {
        type : [routerSchema],
        required : false,
    },
    isContainerCreated : {
        type : Boolean,
        required : false,
        default: false,  
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


containerSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
    },
});

export const Container = model<IContainer>('Container', containerSchema);
Object.seal(Container);