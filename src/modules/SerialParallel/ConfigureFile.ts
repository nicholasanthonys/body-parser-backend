import { Schema, Document, model} from 'mongoose';


export interface IConfigureFile extends Document {
    fileName: String
    alias: String
}

export const configureFileSchema = new Schema({
    file_name: {
        type: Schema.Types.String,
        required: true,
    },
    alias: {
        type: Schema.Types.String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

configureFileSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret._id;
        delete ret.__v;
    },
});
 model<IConfigureFile>('configureFile', configureFileSchema);