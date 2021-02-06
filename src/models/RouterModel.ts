import { Schema, Document, model } from 'mongoose';

export interface IRouterModel extends Document {
    _id: string;
    path: string,
    project_id : string,
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
    project_id: {
        type: String,
        required: true,

    },
    project_directory :  {
        type: String,
        required: true,
        select: false,
    },
    type: {
        type: String,
        default: "serial"
    },
    method: {
        type: String,
        required: true
    },
});


//* Remove _Id and _v from routerSchema when returning to JSON
routerSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
    },
});

routerSchema.pre('validate', function (this: IRouterModel, next: Function) {
   
    this.project_directory = this.get('project_id');
  
    next()
});



export const RouterModel = model<IRouterModel>('RouterModel', routerSchema);
