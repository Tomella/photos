import config from "./config.js";
import Thumb from "./thumb.js";

import yargs from "yargs";

const argv = yargs(process.argv).argv;
const filename = argv.filename;
const direction = argv.direction;

if (!direction) {
    console.log("A direction of rotation [original|left|right|180]");
    process.exit(1);
}

if (!filename) {
   console.log("A photo's filename is required to read.");
   process.exit(1);
}

let thumb = new Thumb(config.processRotate);
let response = await thumb.rotateThumb(filename, direction);

console.log("FINIT");
process.exit(0);
