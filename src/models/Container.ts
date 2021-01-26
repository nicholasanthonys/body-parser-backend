import { Schema, Document, model, plugin } from 'mongoose';
import {IUser} from './User';
import {IProject} from './Project';
import {IRouterModel, routerSchema} from './RouterModel';

//* this package hasn't support typescript
var slug = require('mongoose-slug-updater');

export interface IContainer extends Document {
    _id: string;
    userId : IUser['_id']
    containerId: string,
    name: string;
    slug : string,
    status : string,
    description: string;
    projectId :Array<IProject['_id']>
    routers: [IRouterModel],
    date: Date,
 
}

//* initialize slug
plugin(slug);

const containerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    containerId: {
        type: String,
        required : false,
    },
    name: { 
        type: String,
        required : true, 
    },
    slug: { 
        type: String, 
        slug: "name" ,
        unique : true,
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
    date: {
        type: Date,
        default: Date.now,
    },
});


export const Container = model<IContainer>('Container', containerSchema);
Object.seal(Container);