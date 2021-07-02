const config  = {
    photosDirectory: "../photos/photos/",
    thumbsDirectory: "../photos/photos/thumbs/",

    connection: {
        connectionLimit: 1500,
        host_home: "192.168.1.154",
        host: "192.168.1.154",
        user: process.env.PHOTOS_USER,
        password: process.env.PHOTOS_PASSWORD,
        database: "photos"
    },

    auth: {
        clientID: process.env.PHOTOS_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.PHOTOS_FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.PHOTOS_FACEBOOK_CALLBACK_URL,
    }
};

export default config;
