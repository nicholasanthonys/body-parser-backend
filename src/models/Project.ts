import { Schema, Document, model, plugin } from 'mongoose';
import { IUser } from './User';
import {configureSchema,IConfigure} from './Configure';

var slug = require('mongoose-slug-updater');

//* initialize slug
plugin(slug);
export interface IProject extends Document {
    _id: string;
    userId: IUser['_id']
    name: string;
    description: string;
    date: Date,
    configures : Array<IConfigure>
}

const projectShema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        select: false

    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    slug: { 
        type: String, 
        slug: "name" ,
        unique : true,
    },
    description: {
        type: String,
        required: false
    },
    configures :{
        type : [configureSchema],
        default : [],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


export const Project = model<IProject>('Project', projectShema);
Object.seal(Project);