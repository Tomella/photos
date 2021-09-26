/**
 * Quick and nasty data cleanser. For some reason some dates where UTC 0 while 
 * others were the servers local time zone. It's supposed to be a 
 * SQL DATETIME column which is time zone agnostic but for some reason
 * the MYSQL2 guys and other put it into a Date object. 
 * There is a new class that is zone ignorant and does the right thing 
 * always.
 * 
 * This is simply cleaning up the bad records by re-reading all the images
 * EXIF data and there is a discrepency, adjust the datetime value.
 * 
 */


import Jimp from 'jimp';
import config from './config.js';
import DateTime from "./datetime.js";
import Photo from './photo.js';
import mysql from "mysql2/promise";

const directory = "../photos/photos/"
let pool = mysql.createPool(Object.assign({
   typeCast: function castField(field, useDefaultTypeCasting) {
      if (field.type === "DATETIME") {
         return new DateTime(field.string());
      }
      return (useDefaultTypeCasting());
   }
}, config.connection));

let photo = new Photo(pool);

let query = "SELECT * FROM photo";

let [results] = await pool.query(query);
console.log("There are " + results.length + " records")

let count = 0;
for(let i = 0; i < results.length; i++) {
   let record = results[i];
   let file = await process(directory + record.filename);
   let tags = file._exif.tags;
   let fromNumber = new DateTime(tags.DateTimeOriginal * 1000);


   if (!fromNumber.equals(record.time_point)) {
      count++;
      record.time_point = fromNumber;
      let result = await photo.update(record);
      console.log(
         record.id,
         record.filename,
         record.time_point.toString(),
         "From number: ", fromNumber.toString());
   }
}

console.log("Updated" + count + " records");
pool.end();

async function process(filename) {
   try {
      //console.log(filename);
      let file = await Jimp.read(filename);

      return file;
      //.resize(this.options.width, this.options.height) // resize
      //.quality(this.options.quality) // set JPEG quality
      //.write(this.options.thumbsDirectory + filename); // save
   } catch (e) {
      console.log("That doesn't become a thumbnail: " + filename, e);
      return {
         error: e,
         _exif: { tags: {} }
      };
   }
}
