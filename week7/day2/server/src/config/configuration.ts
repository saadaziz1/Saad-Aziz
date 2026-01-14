export default () => ({
    port: parseInt(process.env.PORT || '5000', 10),
    database: {
        uri: process.env.MONGODB_URI,
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackUrl: process.env.GOOGLE_CALLBACK_URL,
        },
    },
    brevo: {
        apiKey: process.env.BREVO_API_KEY,
        senderEmail: process.env.BREVO_SENDER_EMAIL,
        senderName: process.env.BREVO_SENDER_NAME,
    },
});
