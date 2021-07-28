import Map from "/app/map.js";
import config from "./config.js";
import Thumb from "./thumb.js";

class Icon {
    VIEWING_CLASS = "marker-cluster-viewing"

    constructor(layer) {
        this.layer = layer;
    }

    active() {
        if (this.layer) {
            let div = this.layer._icon;
            if (div) div.classList.add(this.VIEWING_CLASS);
        }
    }

    inactive() {
        if (this.layer) {
            let div = this.layer._icon;
            if (div) div.classList.remove(this.VIEWING_CLASS);
        }
    }
}

const FETCH_POST = {
    method: 'POST',
    cache: 'no-cache'
};


let form = document.querySelector("ph-photo-form");
form.data = data;

let phMessages = document.querySelector("ph-messages");

let thumbImage = document.querySelector("#thumb-link")
let thumb = new Thumb(thumbImage);
thumb.src = config.tracker.thumbsPath + data.filename;

document.addEventListener("thumbrotate", createThumb);
document.addEventListener("saveannotation", saveAnnotation);
document.addEventListener("message", message);


let imagePath = config.tracker.photosPath + data.filename
let imageLink = document.querySelector("#full-size-image-link");
imageLink.setAttribute("href", imagePath);
document.querySelector("#full-size-image").setAttribute("src", imagePath);

let mapManager = new Map(config.map);
mapManager.create();
let map = mapManager.map;
let point = [data.latitude, data.longitude];
let marker = L.marker(point).addTo(map);
map.setView(point);

async function saveAnnotation({ detail }) {
    directMessage({
        type: "info",
        value: "Saving annotation...",
        duration: 3
    });

    let response = await fetch(
        '/saveannotation/' + detail.id + '?annotation=' + detail.annotation,
        FETCH_POST
    );

    let data = await response.json();
    directMessage({
        type: "success",
        value: "Annotation updated.",
        duration: 6
    });
}

async function createThumb({ detail }) {
    directMessage({
        type: "info",
        value: "Generating new thumbnail...",
        duration: 8
    });
    let response = await fetch(
        '/rotatethumb/' + detail.direction + '?id=' + detail.data.id,
        FETCH_POST
    );
    let data = await response.json();

    thumb.src = config.tracker.thumbsPath + data.filename + "?d=" + Date.now();
    console.log(thumb.src);
}

function directMessage(detail) {
    phMessages.setAttribute('value', detail.value);
    phMessages.setAttribute('type', detail.type);
    phMessages.setAttribute('duration', detail.duration ? detail.duration : 7);
}

function message(event) {
    directMessage(event.detail);
}
