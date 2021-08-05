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
document.addEventListener("deletephoto", deletePhoto);
document.addEventListener("message", message);

let thumbsSizeImage = document.querySelector("#thumbs-size-image");
thumbsSizeImage.setAttribute("src", thumb.src);

let imagePath = config.tracker.photosPath + data.filename
let imageLink = document.querySelector("#full-size-image-link");
imageLink.setAttribute("href", imagePath);
let fullSizeImage = document.querySelector("#full-size-image");
fullSizeImage.addEventListener('load', (event) => {
    console.log('The image has fully loaded');
    thumbsSizeImage.parentElement.removeChild(thumbsSizeImage);
});
fullSizeImage.setAttribute("src", imagePath);



let mapManager = new Map(config.map);
mapManager.create();
let map = mapManager.map;
let point = [data.latitude, data.longitude];
let marker = L.marker(point).addTo(map);
map.setView(point);


let nextPrevious = document.querySelector("ph-previous-next");
if(data.next) {
    data.next.url = "/edit/" + data.next.id;
    data.next.thumbPath = config.tracker.thumbsPath + data.next.filename;
    nextPrevious.next = data.next;
}
if(data.previous) {
    data.previous.thumbPath = config.tracker.thumbsPath + data.previous.filename;
    data.previous.url = "/edit/" + data.previous.id;
    nextPrevious.previous = data.previous;
}

async function deletePhoto(ev) {
    directMessage({
        type: "info",
        value: "Deleting photo...",
        duration: 10
    });
    let detail = ev.detail;
    let next = "";
    if(detail.next && detail.next.id) {
        next = detail.next.id;
    } else if(detail.previous && detail.previous.id) {
        next = detail.previous.id;
    }
    window.location.replace("/delete/" + detail.id + "?next=" + next);
}

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
        duration: 20
    });
    let response = await fetch(
        '/rotatethumb/' + detail.direction + '?id=' + detail.data.id,
        FETCH_POST
    );
    let data = await response.json();

    clearMessage();

    thumb.src = config.tracker.thumbsPath + data.filename + "?d=" + Date.now();
    console.log(thumb.src);
}

function directMessage(detail) {
    phMessages.setAttribute('value', detail.value);
    phMessages.setAttribute('type', detail.type);
    phMessages.setAttribute('duration', detail.duration ? detail.duration : 7);
}

function clearMessage() {
    phMessages.setAttribute('clear', Date.now());
}

function message(event) {
    directMessage(event.detail);
}
