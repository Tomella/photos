import Photo from "../lib/photo.js";
import Thumb from "../lib/thumb.js";
import config from "../lib/config.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import mysql from "mysql2/promise";
import { response } from "express";

const argv = yargs(hideBin(process.argv)).argv;

const id = +argv.id;
const direction = argv.direction;

if (!id) {
    console.log("You need to specify at least an id for this to work.");
    process.exit(1);
}


if (direction != "left" && direction != "right" && direction != "180" && direction != "original") {
    console.log("That is not a valid rotation amount: " + direction);
    process.exit(2);
}

run().then(() => {
    process.exit(0);
});


async function run() {
    const thumb = new Thumb(config);
    let connection = await mysql.createConnection(config.connection);
    await connection.connect();

    let photoService = new Photo(connection)
    let data = await photoService.findById(id);
    console.log(data, direction);
    let response = await thumb.rotateThumb(data.filename, direction);
    console.log(response)
    return response;
}
