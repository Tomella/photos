import express from "express";
import config from "./lib/config.js";
import ejs from "ejs";
import mysql from "mysql2/promise";
import passport from "passport";
import passportFacebook from 'passport-facebook';
import session from "express-session";

import Photo from "./lib/photo.js";
import Thumb from "./lib/thumb.js";
import User from "./lib/user.js";
import ExtentRequest from "./src/quadtree/extentrequest.js";
import QueryingService from "./src/photos/queryingservice.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FacebookStrategy = passportFacebook.Strategy;

const port = 3000;

let points = null;



run().then(() => console.log("Running"));

async function run() {
   const pool = mysql.createPool(config.connection);
   const photo = new Photo(pool);
   const user = new User(pool);
   const thumb = new Thumb(config.server);

   points = await photo.all();


   console.log(JSON.stringify(points, null, 2));

   let queryingService = new QueryingService(config);
   let photos = await photo.all();
   queryingService.load(pointsToJson(photos));

   //var httpProxy = require('http-proxy');
   let app = express();
   app.set('view engine', 'ejs');
   app.engine('html', ejs.renderFile);

   // serve static files

   app.use(express.static("web"));
   app.use(express.static("photos"));
   app.use('/src', express.static('src'));


   app.use(session({
      resave: false,
      saveUninitialized: true,
      secret: 'SECRET'
   }));

   app.use(passport.initialize());
   app.use(passport.session());

   passport.serializeUser(function (user, cb) {
      cb(null, user);
   });

   passport.deserializeUser(function (obj, cb) {
      cb(null, obj);
   });


   passport.use(new FacebookStrategy({
      clientID: config.auth.PHOTOS_FACEBOOK_CLIENT_ID,
      clientSecret: config.auth.PHOTOS_FACEBOOK_CLIENT_SECRET,
      callbackURL: config.auth.PHOTOS_FACEBOOK_CALLBACK_URL,
      failureFlash: true,
      profileFields: ["email", "name"]
   },
      async function (accessToken, refreshToken, profile, cb) {
         console.log("(accessToken, refreshToken, profile, cb", accessToken, refreshToken, profile);
         let client = await user.findCreate(profile._json);
         profile.admin = client.admin;
         cb(null, profile);
      }
   ));

   app.get('/auth/facebook', passport.authenticate('facebook', {
      scope: ['public_profile', 'email']
   }));

   app.get('/callback/facebook',
      passport.authenticate('facebook', {
         successRedirect: '/',
         failureRedirect: '/error'
      })
   );

   app.all('/all', async (req, res) => {
      let photos = await photo.all(req.query.startDate, req.query.endDate);
      let response = pointsToJson(photos);
      if(req.user) {
         response = Object.assign(response, { properties: {user: req.user.name, admin: req.user.admin}});
      }
      res.status(200).send(response);
   });

   app.all('/user.js', async (req, res) => {
      let response = {name: null, admin: "N"};
      if(req.user) {
         response =  { name: req.user.name, admin: req.user.admin};
      }
      let str = "export default " + JSON.stringify(response);
      res.setHeader('Content-Type', "application/javascript; charset=UTF-8").send(str);
   });

   app.all('/error', async (req, res) => {
      res.json({success: false});
   });

   app.all('/success', async (req, res) => {
      let raw = req.user._json;

      let data = await user.findCreate(raw);
      res.json(data);
   });

   app.get('/logout', async (req, res) => {
      req.logout();
      res.redirect('/');
   });

   app.all('/clusters', async (req, res) => {
      console.log(req.query);
      let zoom = (+req.query.zoom) ? req.query.zoom : 18;
      let request = new ExtentRequest(-179, 179, -89, 89, zoom);
      let response = await queryingService.getSummary(request);
      res.status(200).send(response);
   });

   app.all('/edit/:id', isAdmin, async (req, res) => {
      let data = await photo.findById(req.params.id);

      ejs.renderFile(__dirname + "/views/edit.ejs", { data: JSON.stringify(data) }, {}, function (err, str) {
         if (err) {
            console.log(err)
            res.writeHead(503, 'System error');
            res.end()
         } else {
            res.status(200).send(str);
         }
      })
   });

   // Direction can be right, left, 180 or original. All are relative to the original photo.
   app.all('/rotatethumb/:direction', isAdmin, async (req, res) => {
      try {
         let data = await photo.findById(req.query.id);
         await thumb.rotateThumb(data.filename, req.params.direction);
         res.send(data);
      } catch(e) {
         res.send(e);
      }
   });

   // Direction can be right, left, 180 or original. All are relative to the original photo.
   app.all('/saveannotation/:id', isAdmin, async (req, res) => {
      try {
         let data = await photo.findById(req.params.id);
         data.annotation = req.query.annotation;
         await photo.update(data);
         res.send(data);
      } catch(e) {
         res.send(e);
      }
   });

   app.listen(port, function (err) {
      console.log("running server on port " + port);
   });
}

function isAdmin(req, res, next) {
   if (req.isAuthenticated() && req.user && req.user.admin === "Y") {
      return next();

   }
   res.redirect('/');
}

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated())
      return next();
   res.redirect('/');
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
            annotation: photo.annotation,
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
