export default () => ({
    port: parseInt(process.env.PORT || '4000'),
    env: process.env.NODE_ENV,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
});
