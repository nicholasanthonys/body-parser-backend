
import mongoose from 'mongoose'
export const connectToMongo = async (mongoURI : string) => {
    console.log(`connect to mongo URI :${mongoURI} `)
    try {
        await mongoose.connect(
            `${mongoURI}`, // Use template string otherwise this will be error
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