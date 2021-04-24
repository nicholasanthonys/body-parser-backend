import { Schema, Document, model } from 'mongoose';


export interface IConfigureFileParallel extends Document {
    configure_id: String
    alias: String
}

export const configureFileParallelSchema = new Schema({
    configure_id: {
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

configureFileParallelSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any, options: any) => {
        delete ret._id;
        delete ret.__v;
    },
});
export const ConfigureFileParallel = model<IConfigureFileParallel>('configureFileParallel', configureFileParallelSchema);