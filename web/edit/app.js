import Map from "/app/map.js";
import config from "./config.js";
import Thumb from "./thumb.js";
import Message from "./message.js";

const FETCH_POST = {
    method: 'POST',
    cache: 'no-cache'
};
let keywords = [];



prepareKeywords();
let messages = new Message(document.querySelector("ph-messages"));

prepareImage(prepareThumb()); // Image removes thumb on load.
prepareMap();
prepareNextPrevious();
addListeners();

let form = document.querySelector("ph-photo-form");
form.data = data;

async function deletePhoto(ev) {
    postMessage("info", "Deleting photo...", 10);
    let detail = ev.detail;
    let next = "";
    if (detail.next && detail.next.id) {
        next = detail.next.id;
    } else if (detail.previous && detail.previous.id) {
        next = detail.previous.id;
    }
    window.location.replace("/delete/" + detail.id + "?next=" + next);
}

async function saveAnnotation({ detail }) {
    postMessage("info", "Saving annotation...", 3);

    let response = await fetch(
        '/saveannotation/' + detail.id + '?annotation=' + detail.annotation,
        FETCH_POST
    );

    await response.json();
    postMessage("success", "Annotation updated.", 6);
}

async function createThumb({ detail }) {
    postMessage("info", "Generating new thumbnail...", 20);
    let response = await fetch(
        '/rotatethumb/' + detail.direction + '?id=' + detail.data.id,
        FETCH_POST
    );
    let data = await response.json();

    clearMessage()

    thumb.src = config.tracker.thumbsPath + data.filename + "?d=" + Date.now();
    console.log(thumb.src);
}

async function prepareKeywords() {
    let phKeywords = document.querySelector("ph-keywords");
    let response = await fetch('/keywords/all');

    keywords = await response.json();
    phKeywords.data = reduceKeywords();
}

function reduceKeywords() {
    let existing = data.keywords.reduce((acc, item) => {
        acc[item.name] = item.name;
        return acc;
    }, {});
    return keywords.filter(item => !!!existing[item.name]);
}

async function saveKeyword(ev) {
    postMessage("Adding keyword to photo.", "info", 3);
    await updateKeyword('/keywords/save/' + data.id + '?name=' + ev.detail.value);
    clearMessage()
}

async function removeKeyword({ detail }) {
    postMessage("Removing keyword from photo.", "info", 3);
    await updateKeyword('/keywords/unlink/' + data.id + '?name=' + detail.value);
    clearMessage()
}

async function updateKeyword(url) {
    let response = await fetch(url, FETCH_POST);
    let keywords = await response.json();
    data.keywords = keywords;

    let phKeywords = document.querySelector("ph-keywords");
    phKeywords.data = reduceKeywords();
    form.refreshKeywords();
}

function postMessage(value, type, duration) {
    messages.post({ value, type, duration });
}

function clearMessage() {
    messages.clear();
}

function message(event) {
    messages.post(event.detail);
}

function addListeners() {
    document.addEventListener("thumbrotate", createThumb);
    document.addEventListener("saveannotation", saveAnnotation);
    document.addEventListener("savekeyword", saveKeyword, true);
    document.addEventListener("removekeyword", removeKeyword);
    document.addEventListener("deletephoto", deletePhoto);
    document.addEventListener("message", message);
}

function prepareThumb() {
    let thumbImage = document.querySelector("#thumb-link")
    let thumb = new Thumb(thumbImage);
    thumb.src = config.tracker.thumbsPath + data.filename;
    let thumbsSizeImage = document.querySelector("#thumbs-size-image");
    thumbsSizeImage.setAttribute("src", thumb.src);
    return thumbsSizeImage;
}

function prepareImage(thumbsSizeImage) {
    let imagePath = config.tracker.photosPath + data.filename
    let imageLink = document.querySelector("#full-size-image-link");
    imageLink.setAttribute("href", imagePath);
    let fullSizeImage = document.querySelector("#full-size-image");
    fullSizeImage.addEventListener('load', (event) => {
        console.log('The image has fully loaded');
        thumbsSizeImage.parentElement.removeChild(thumbsSizeImage);
        fullSizeImage.classList.remove("hide-image");
    });
    fullSizeImage.setAttribute("src", imagePath);
}

function prepareMap() {
    let mapManager = new Map(config.map);
    mapManager.create();
    mapManager.addPoint([data.latitude, data.longitude], true);
}

function prepareNextPrevious() {
    // Set up next and previous buttons.
    let nextPrevious = document.querySelector("ph-previous-next");
    if (data.next) {
        data.next.url = "/edit/" + data.next.id;
        data.next.thumbPath = config.tracker.thumbsPath + data.next.filename;
        nextPrevious.next = data.next;
    }
    if (data.previous) {
        data.previous.thumbPath = config.tracker.thumbsPath + data.previous.filename;
        data.previous.url = "/edit/" + data.previous.id;
        nextPrevious.previous = data.previous;
    }
}
