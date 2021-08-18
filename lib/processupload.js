import Thumb from './thumb.js';
import { promises as fs } from "fs";
import fsExtra from "fs-extra";
import config from "./config.js";
import mysql from "mysql2/promise";
import Photo from "./photo.js";

import yargs from "yargs";

let directories = config.processUploads;

const argv = yargs(process.argv).argv;
const jsonLocation = argv.file;

if (!jsonLocation) {
    console.log("You need to specify a file to load the list to process");
    process.exit(1);
}

console.log("Location: ", jsonLocation);

let pool = null;

run().then(result => {
    console.log(result);
    console.log("Finit");
}).catch(err => {
    console.log("Something went wrong, ending pool.", err);
    pool.end();
    process.exit(99);
});

async function run() {
    let str = await fs.readFile(jsonLocation);
    let files = JSON.parse(str);

    pool = mysql.createPool(config.connection);
    const photo = new Photo(pool);
    const thumb = new Thumb(directories);

    let result = [];
    for (var i = 0; i < files.length; i++) {
        let file = files[i];
        let filename = file.originalname;
        let entry = {filename};
        result.push(entry);

        // Create thumbnail
        // Add data row to database
        let src = directories.uploadsDirectory + file.filename;
        let dest = directories.photosDirectory + filename;

        let journal = entry.journal  = ["Moving temporary file to photos store..."];
        try {
            // Move file to photos directory
            let move = await fsExtra.move(src, dest, { overwrite: false });
            journal.push("Succesfully moved photo to photos store");
            journal.push("Creating thumbnail from photo...");

            let data = await thumb.process(filename);

            let exif = data._exif;
            let tags = exif.tags;
            if (tags.GPSLatitude || tags.GPSLatitude === 0) {
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
                journal.push("File did not have EXIF data so we are ignoring.")
            }
            result.push(exif);
        } catch (e) {
            console.log(e);
            journal.push("We failed to move photo. This is usually because it is a duplicate.")
        }
    }
    pool.end();
    return result;
}