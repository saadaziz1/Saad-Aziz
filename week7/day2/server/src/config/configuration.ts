export default () => ({
    port: parseInt(process.env.PORT || '5000', 10),
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/decentral',
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
        },
    },
    brevo: {
        apiKey: process.env.BREVO_API_KEY,
        senderEmail: process.env.BREVO_SENDER_EMAIL || 'no-reply@decentral.com',
        senderName: process.env.BREVO_SENDER_NAME || 'Decentral',
    },
});
