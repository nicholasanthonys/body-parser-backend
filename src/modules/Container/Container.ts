import { Schema, Document, model } from 'mongoose';
import { IUser } from '../User';
import { IProject } from '../Project/Project';
import { IRouterModel, routerSchema } from '../RouterModel';



export interface IContainer extends Document {
    _id: string;
    user_id: IUser['_id']
    container_id: string,
    name: string;
    description: string;
    project_ids: Array<IProject['_id']>
    routers: Array<IRouterModel>,
    date: Date,
}

export interface IContainerCustom {
    _id: string;
    user_id: IUser['_id']
    container_id: string,
    name: string;
    description: string;
    project_ids: Array<IProject['_id']>
    routers: Array<IRouterModel>,
    date: Date,

    //* will be fetched from docker daemon
    running: boolean
}


const containerSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    container_id: {
        type: String,
        required: false,
        default: null
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    project_ids: {
        type: [Schema.Types.ObjectId],
        required: false,
        default: [],
    },
    routers: {
        type: [routerSchema],
        required: false,
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