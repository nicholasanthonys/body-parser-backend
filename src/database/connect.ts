
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
const DB_CONNECT = process.env.DB_CONNECT;
export const connectToMongo = async () => {
    try {
        await mongoose.connect(
            `${DB_CONNECT}`, // Use template string otherwise this will be error
            {
                useFindAndModify: false,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            },
        )
        console.log("conected to db");
    } catch (err) {
        console.log(err)
    }
}