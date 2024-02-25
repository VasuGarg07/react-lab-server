import mongoose from "mongoose"
import { MONGO_URI } from "./app.config"

export const connectDb = () => {
    return mongoose.connect(MONGO_URI, {
        appName: 'React Lab Server',
        autoCreate: true,
        autoIndex: true
    })
}