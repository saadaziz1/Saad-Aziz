import { registerAs } from "@nestjs/config";
import { v2 as cloudinary } from 'cloudinary'

export default registerAs('cloudinary', () => {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
    const api_key = process.env.CLOUDINARY_API_KEY
    const api_secret = process.env.CLOUDINARY_API_SECRET

    if (!cloud_name || !api_key || !api_secret) {
        console.warn('Cloudinary configuration is missing')
    }

    cloudinary.config({
        cloud_name,
        api_key,
        api_secret
    })

    return cloudinary
})