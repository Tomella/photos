import DateTime from "./datetime.js";

const config = {
   port: process.env.PHOTOS_SERVER_PORT ? +process.env.PHOTOS_SERVER_PORT : 3000,
   photosDirectory: "../photos/photos/",
   thumbsDirectory: "../photos/photos/thumbs/",
   
   processUploads: {
      photosDirectory: "./photos/photos/",
      thumbsDirectory: "./photos/photos/thumbs/",
      uploadsDirectory: "./uploads/",
      resultsDirectory: "./results/"
   },

   processDownload: {
      photosDirectory: "/photos/photos/"
   },

   processRotate: {
      photosDirectory: "./photos/photos/",
      thumbsDirectory: "./photos/photos/thumbs/"
   },

   // Connect to a database. See schema under the data directory
   connection: {
      connectionLimit: 1500,
      host: process.env.PHOTOS_DB_HOST ? process.env.PHOTOS_DB_HOST : "192.168.1.45",
      user: process.env.PHOTOS_USER,
      password: process.env.PHOTOS_PASSWORD,
      database: process.env.PHOTOS_DB,
      typeCast: function castField( field, useDefaultTypeCasting ) {
         if ( field.type === "DATETIME"  ) {
            return new DateTime(field.string());
         }
         return( useDefaultTypeCasting());
      }
   },
   
   server: {
      photosDirectory: "./photos/photos/",
      thumbsDirectory: "./photos/photos/thumbs/"
   },

   elevation: {
      getElevationUrl: "https://api-elevation.fsdf.org.au/elevation-at-point?lat=$lat&long=$lng"
   },

   // When running onmachine with an environment variable set to true, act as though user is logged in.
   isLocal: {
      on: process.env.PHOTOS_LOCAL == "true",
      user: {
         name: {
            givenName: "DUMMY",
            familyName: "ADMIN"
         },
         admin: "Y"
      }
   },

   // 1:1 mapping of resource to relative URL so the user can't tunnel to other resources.
   staticMappings: [{
      url: "qrcode.js",
      path: "qrcode/build/qrcode.js"
   }]
};

export default config;
