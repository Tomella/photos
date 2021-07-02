import config from "./config.js";
import mysql from "mysql2/promise";
import Photo from "./photo.js";

run().then(result => {
    console.log(result);
});

async function run() {
    const pool = await mysql.createPool(config.connection);
    const photo = new Photo(pool);
    return photo.all();
}
