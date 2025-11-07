import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/conf.config.js";

cloudinary.config({
    cloud_name: config.cloudinaryCloudNmae,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
});

export default cloudinary;
