const config = {
   port: process.env.PHOTOS_SERVER_PORT ? +process.env.PHOTOS_SERVER_PORT : 3000,
   photosDirectory: "../photos/photos/",
   thumbsDirectory: "../photos/photos/thumbs/",

   processUploads: {
      photosDirectory: "./photos/photos/",
      thumbsDirectory: "./photos/photos/thumbs/",
      uploadsDirectory: "./uploads/"
   },


   processRotate: {
      photosDirectory: "./photos/photos/",
      thumbsDirectory: "./photos/photos/thumbs/"
   },

   connection: {
      connectionLimit: 1500,
      host: "192.168.1.154",
      user: process.env.PHOTOS_USER,
      password: process.env.PHOTOS_PASSWORD,
      database: process.env.PHOTOS_DB
   },

   auth: {
      clientID: process.env.PHOTOS_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.PHOTOS_FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.PHOTOS_FACEBOOK_CALLBACK_URL,
   },

   server: {
      photosDirectory: "./photos/photos/",
      thumbsDirectory: "./photos/photos/thumbs/"
   },

   isLocal: {
      on: process.env.PHOTOS_LOCAL == "true",
      user: {
         name: {
            givenName: "DUMMY",
            familyName: "ADMIN"
         },
         admin: "Y"
      }
   }
};

export default config;
