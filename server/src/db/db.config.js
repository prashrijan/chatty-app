import mongoose from "mongoose";
import { config } from "../config/conf.config.js";

const mongoDbUri = config.mongoDbUri;
const dbName = config.dbName;

export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(`${mongoDbUri}/${dbName}`);
        conn &&
            conn.connection.host &&
            console.log("Database is connected successfully.");
    } catch (error) {
        console.log("Error connecting to the database: ", error);
        throw error;
    }
};
