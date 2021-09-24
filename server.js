import express from "express";
import config from "./lib/config.js";
import ejs from "ejs";
import mysql from "mysql2/promise";
import { spawn } from "child_process";

import Photo from "./lib/photo.js";
import StaticMapper from "./lib/staticmapper.js";
import Thumb from "./lib/thumb.js";
import User from "./lib/user.js";

import pointsToJson, {zoneFreeDateStr} from "./lib/pointstojson.js";

import KeywordsRouter from "./routers/keywords.js";
import PhotoRouter from "./routers/photo.js";
import SecurityRouter from "./routers/securityrouter.js";
import AlbumRouter from "./routers/album.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = config.port;


const pool = mysql.createPool(config.connection);
const photo = new Photo(pool);
const user = new User(pool);

const thumb = new Thumb(config.server);

const keywordsRouter = new KeywordsRouter(pool);
const albumRouter = new AlbumRouter(pool);

let photos = await photo.all();

//var httpProxy = require('http-proxy');
let app = express();
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.use(express.urlencoded({ extended: false }))
// serve static files

app.use(express.static("web"));
app.use(express.static("photos"));
app.use('/src', express.static('src'));

app.use('/keywords', keywordsRouter.router);
app.use('/albumService', albumRouter.router);
const securityRouter = new SecurityRouter(config, app, user);

app.all('/download/:name', function (req, res) {
   let path = __dirname + config.processDownload.photosDirectory + sanitise(req.params.name);
   console.log("PATH = " + path)
   res.download(path);
});

// It has to be down here to pick up the authentication.
const photoRouter = new PhotoRouter(config.server, photo, app, [isAdmin]);
const staticMapper = new StaticMapper(app, "/scripts/", __dirname + '/node_modules/', config.staticMappings);

app.all('/all', async (req, res) => {
   let photos = await photo.all(req.query.startDate, req.query.endDate);
   let response = pointsToJson(photos);
   if (req.user) {
      response = Object.assign(response, { properties: { user: req.user.name, admin: req.user.admin } });
   }
   res.status(200).send(response);
});

app.all('/error', async (req, res) => {
   res.json({ success: false });
});

app.all('/success', async (req, res) => {
   let raw = req.user._json;

   let data = await user.findCreate(raw);
   res.json(data);
});

app.all('/edit/:id', isAdmin, async (req, res) => {
   let id = req.params.id;
   let data = await photo.findByIdWithAdjacent(id);
   if (!data) {
      data = await photo.findNext(id);
      if (!data) {
         data = await photo.findPrevious(id);
      }

      if (!data) {
         res.redirect('/');
      } else {
         id = data.id;
         res.redirect('/edit/' + id);
      }
   } else {
      data.time_point = zoneFreeDateStr(data.time_point);
      if(data.next) {
         data.next.time_point = zoneFreeDateStr(data.next.time_point);
      }
      if(data.previous) {
         data.previous.time_point = zoneFreeDateStr(data.previous.time_point);
      }

      ejs.renderFile(__dirname + "/views/edit.ejs", { data: JSON.stringify(data) }, {}, function (err, str) {
         if (err) {
            console.log(err)
            res.writeHead(503, 'System error');
            res.end()
         } else {
            res.status(200).send(str);
         }
      });
   }
});

// Direction can be right, left, 180 or original. All are relative to the original photo.
app.all('/rotatethumbOld/:direction', isAdmin, async (req, res) => {
   try {
      let data = await photo.findById(req.query.id);
      await thumb.rotateThumb(data.filename, req.params.direction);
      res.send(data);
   } catch (e) {
      res.send(e);
   }
});

// Direction can be right, left, 180 or original. All are relative to the original photo.
app.all('/rotatethumb/:direction', isAdmin, async (req, res, next) => {
   let data = await photo.findById(req.query.id);

   let subprocess = spawn("node", ['lib/processrotate.js', '--filename=' + data.filename, '--direction=' + req.params.direction]);

   for await (const chunk of subprocess.stdout) {
      console.log('stdout chunk: ' + chunk);
   }

   let code = await new Promise((resolve, reject) => {
      subprocess.on('close', resolve);
   });
   if (code === 0) {
      res.send(data);
   } else {
      res.json({ success: !code });;
   }
});

// Direction can be right, left, 180 or original. All are relative to the original photo.
app.all('/saveannotation/:id', isAdmin, async (req, res) => {
   try {
      let data = await photo.findById(req.params.id);
      data.annotation = req.query.annotation;
      await photo.update(data);
      res.send(data);
   } catch (e) {
      res.send(e);
   }
});

app.listen(port, function (err) {
   console.log("running server on port " + port);
});


function isAdmin(req, res, next) {
   if (securityRouter.security.isAdmin(req)) {
      return next();
   }
   res.redirect('/');
}

function sanitise(input) {
   // Just wipe out multiple full stops, slashes and backslashes at the moment.
   return (input ? input : "").replace(/\\|\/|\.{2,}/gi, "");
}
