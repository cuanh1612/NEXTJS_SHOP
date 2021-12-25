import mongoose, { ConnectOptions } from "mongoose";

export const connectDB = async () => {
    console.log(process.env.MONGODB_URL);
    
    //Check already connect mongoDB
    if (mongoose.connections[0].readyState) {
        console.log('Already connected.')
        return
    }

    //Connect to mongo DB if not already nonected
    await mongoose.connect(
        process.env.MONGODB_URL as string,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions,
        err => {
            if (err) throw err
            console.log('Connected to mongodb.')
        }
    )
}
