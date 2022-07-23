import Elevation from './elevation.js';
import config from "./config.js";
import mysql from "mysql2/promise";
import Photo from "./photo.js";
import e from 'express';

const mapLocations = {};
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
let elevation = null;
let pool = null;

run().then(result => {
    console.log("Finit");
}).catch(err => {
    console.log("Something went wrong, ending pool.", err);
}).finally(something => {
    pool.end()
});

async function run() {
    pool = await mysql.createPool(config.connection);
    const photo = new Photo(pool);
    const all = await photo.all();
    const zeros = all.filter(photo => photo.elevation == 0)

    //console.log(zeros);
/*
    zeros.forEach(point => {
        let key = point.latitude +"," + point.latitude;
        let collection = mapLocations[key];
        if(!collection) {
            collection = [];
            mapLocations[key] = collection;
        }
        collection.push(point);
    });

    console.log(Object.keys(mapLocations).length, Object.keys(mapLocations));
    return;
*/
    elevation = new Elevation(config.elevation.getElevationUrl);
    let elapsed = new Date().getTime();
    for(let i = 0; i < zeros.length; i++) {
        let point = zeros[i];
        let response = await elevationAtPoint(point.latitude, point.longitude);
        let elevation = response ? response['HEIGHT AT LOCATION'] : NaN;
        if(isNaN(elevation)) {
            console.log(point, response, elevation + "is not a number");
            continue;
        }
        point.elevation = elevation;
        point = await photo.update(point);
        let t = 100 + Math.random()*400;
        await sleep(t);
        let latest = new Date().getTime();
        let measured = latest - elapsed;
        elapsed = latest;
        console.log("It took " + measured);
    }

   // const res = await elevation.atPoint(LAT, LNG);
   // console.log(res)

}

async function elevationAtPoint(lat, lng) {
    return elevation.atPoint(lat, lng);
}

async function all() {
    const pool = await mysql.createPool(config.connection);
    const photo = new Photo(pool);
    return photo.all();
}
