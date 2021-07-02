import express from "express";
import cookie from "cookie";
import config from "./lib/config.js";
import mysql from "mysql2/promise";
import Photo from "./lib/photo.js";
import ExtentRequest from "./src/quadtree/extentrequest.js";
import QueryingService from "./src/photos/queryingservice.js";


const port = 3000;

let points = null;


run().then(() => console.log("Running"));

async function run() {
   const pool = mysql.createPool(config.connection);
   const photo = new Photo(pool);

   points = await photo.all();


   console.log(JSON.stringify(points, null, 2));

   let queryingService = new QueryingService(config);
   let photos = await photo.all();
   queryingService.load(pointsToJson(photos));

   //var httpProxy = require('http-proxy');
   let app = express();

   // serve static files

   app.use(express.static("web"));
   app.use(express.static("photos"));
   app.use('/src', express.static('src'));

   app.all('/all', async (req, res) => {
      console.log(req.query);
      let photos = await photo.all(req.query.startDate, req.query.endDate);
      res.status(200).send(pointsToJson(photos));
   });


   app.all('/login', async (req, res) => {
      let cookies = cookie.parse(req.headers.cookie || '');
      console.log(cookies, req.query);
      res.status(200).send({ok: true});
   });

   app.all('/clusters', async (req, res) => {
      console.log(req.query);
      let zoom = (+req.query.zoom)? req.query.zoom : 18;
      let request = new ExtentRequest(-179, 179, -89, 89, zoom);
      let response = await queryingService.getSummary(request);
      res.status(200).send(response);
   });

   app.listen(port, function (err) {
      console.log("running server on port " + port);
   });
}

function pointsToJson(photos, name = "photos") {
   return {
      type: "FeatureCollection",
      name,
      features: photos.map(photo => ({
         type: "Feature",
         properties: {
            name: photo.filename,
            description: photo.description,
            id: photo.id,
            time_point: photo.time_point,
            elevation: photo.elevation
         },
         geometry: {
            type: "Point",
            coordinates: [
               photo.longitude,
               photo.latitude
            ]
         }
      }))
   };
}
