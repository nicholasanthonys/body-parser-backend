import { model, Schema, Document } from "mongoose";

export interface IConfigureFile extends Document {
    loop : String | null
    configure_id: String
    file_name : String,
    alias: String
}


export const configureFileSchema = new Schema({
    configure_id: {
        type: Schema.Types.String,
        required: true,
    },
    file_name :  {
        type: Schema.Types.String,
        required: true,
    },
    alias: {
        type: Schema.Types.String,
        required: true,
    },
    loop : {
        type: Schema.Types.String,
        required: false,
        default : null
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

configureFileSchema.pre('validate', function (this: IConfigureFile, next: Function) {

    this.file_name= this.get('configure_id') + ".json";

    next()
});

configureFileSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret._id;
        delete ret.__v;
    },
});

export const ConfigureFile = model<IConfigureFile>('configureFile', configureFileSchema);