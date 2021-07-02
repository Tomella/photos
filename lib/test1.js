import { dirFiles } from "./directory.js";
import Thumb from './thumb.js';
import { promises as fs } from "fs";
import config from "./config.js";
import mysql from "mysql2/promise";
import Photo from "./photo.js";

let pool = null;

run().then(result => {
    //console.log(result);
    console.log("Finit");
}).catch(err => {
    console.log("Something went wrong, ending pool.", err);
    pool.end();
});

async function run() {
    pool = mysql.createPool(config.connection);
    const photo = new Photo(pool);
    const thumb = new Thumb(config);

    const thumbs = await fs.readdir(config.thumbsDirectory);
    const thumbSet = new Set(thumbs);
    const dirData = await dirFiles(config.photosDirectory);
    const files = dirData.children.filter(file => !thumbSet.has(file.name));
    
    let result = [];
    for (var i = 0; i < files.length; i++) {
        const filename = files[i].name;
    
        let data = await thumb.process(filename);
        let exif = data._exif;
        let tags = exif.tags;
        if(tags.GPSLatitude || tags.GPSLatitude === 0) {
            console.log("Write to DB: " + filename);
            // console.log(tags);
            let elevation = +(tags.GPSAltitude || 0);
            // Maybe we should wait 
            let status = await photo.write({
                description: tags.Make + " " + tags.Model,
                filename,
                latitude: +tags.GPSLatitude,
                longitude: +tags.GPSLongitude,
                elevation,
                time_point: new Date(tags.CreateDate * 1000)
            });
        } else {
            console.log(filename + " does not have GPS metadata.");
            console.log(exif);
            console.log("***********");
        }
        result.push(exif);
    }
    pool.end();
    return result;
}
