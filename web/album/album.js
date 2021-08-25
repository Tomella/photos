import loader from "../lib/loader.js";
import config from "./config.js";
import Keyword from "./keyword.js";

let intv = null;
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const entry = urlSearchParams.entries().next().value;
document.querySelector("#album-title").innerHTML = entry[1]; 

const keyword = new Keyword(config.keyword);

window.onload = async (el) => { 
    let response = await loader("/albumService/keyword" + window.location.search);
    let container = document.querySelector("al-image-container");
    response.forEach(feature => {
        let image = document.createElement("al-image");
        image.onload = counter;
        image.setAttribute("src", config.thumbsPath + feature.filename);
        container.appendChild(image);
    });
    window.onresize = update;
}

function counter(ev) {
    console.log(ev);
    if(intv) {
        return;
    }
    intv = setTimeout(update, 150);
}

function update() {
    document.querySelector("al-image-container").update();
    intv = null;
}
