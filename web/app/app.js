import Map from "./map.js";
import config from "./config.js";
import Tracker from "./tracker.js";
import user from "/user.js";
import loader from "../lib/loader.js";
import AddImageCtl from "/lib/addimagectl.js";

class Icon {
    VIEWING_CLASS = "marker-cluster-viewing"

    constructor(layer) {
        this.layer = layer;
    }

    active() {
        if(this.layer) {
            let div = this.layer._icon;
            if(div) div.classList.add(this.VIEWING_CLASS);
        }
    }

    inactive() {
        if(this.layer) {
            let div = this.layer._icon;
            if(div) div.classList.remove(this.VIEWING_CLASS);
        }
    }
}

let mapManager = new Map(config.map);
let clusterSticky = false;
let lastSticky = null;
let lastIcon = new Icon(null);

mapManager.create();
// Show all to begin with
let tracker = new Tracker(config.tracker, mapManager.map);


let phDialog = document.querySelector("ph-dialog");
let phThumbLink = document.querySelector("ph-thumb-link");
let phMessages = document.querySelector("ph-messages");
let phGraph = document.querySelector("ph-graph");

let result = await broadcastPoints();
let features = result.features;

phGraph.data = result;

phDialog.addEventListener("change", async (e) => {
   broadcastFilteredPoints(e.detail.startDate, e.detail.endDate);
});

phThumbLink.addEventListener("close", (e) => {
    clusterSticky = false;
    clusterOut();
});

phThumbLink.addEventListener("edit", (e) => {
    console.log("EDIT: ", e.detail);
    window.location = "/edit/" + e.detail.id;
});

document.addEventListener("clusterclick", clusterClick);
document.addEventListener("clusterover", clusterOver);
document.addEventListener("clusterout", clusterOut);
document.addEventListener("message", message);
document.addEventListener("loggedin", loggedIn);
phGraph.addEventListener("changedates", changeDates);

document.addEventListener("keyup", function(evt) {
    if (evt.key === "Escape" || evt.key === "Esc") {
        clusterSticky = false;
        clusterOut();
    }
});

if(user.name) {
    console.log("User fetched", user);
    document.dispatchEvent(new CustomEvent('loggedin', { detail: user}));

    let addImageCtl = new AddImageCtl(document.querySelector("ph-add-image"));
    addImageCtl.show();
}

async function broadcastPoints() {
   let points = await loader(config.listUrl);
   // These are those who care.
   tracker.track(points);
   return points;
}

function broadcastFilteredPoints(startDate = "1900-01-01", endDate = "9999-12-31") {
   let filtered = []; 
   if(result) {
      filtered = features.filter(feature => {
         let day = feature.properties.time_point.substr(0, 10);
         return day >= startDate && day <= endDate;
      });
      result.features = filtered;
   }
   tracker.track(result);
}

function message(event) {
    // TODO We want to run an event driven message service.
    let detail = event.detail;
    phMessages.setAttribute('value', detail.value);
    phMessages.setAttribute('type', detail.type);
    phMessages.setAttribute('duration', detail.duration ? detail.duration: 7);
}

function clusterClick(event) {
    let layer = event.detail.layer;
    let properties = layer.options;

    lastIcon.inactive();

    if(clusterSticky && lastSticky && lastSticky.id == properties.id) {
        clusterSticky = false;
        lastSticky = null;
        phThumbLink.data = null;
        return;
    }

    document.dispatchEvent(new CustomEvent("message", {
        detail: {
            type: "info",
            value: "Click on the thumbnail to open photo in seperate window.",
            duration: 5
        }
    }));
    lastSticky = properties;

    console.log("clusterClick", event);
    clusterSticky = false;
    clusterOver(event);
    phThumbLink.data = properties;
    clusterSticky = true;
}

function clusterOver(event) {
    console.log("clusterOver", event);
    if(clusterSticky) return;

    let layer = event.detail.layer;
    let properties = layer.options;

    lastIcon.inactive();
    lastIcon = new Icon(layer);
    lastIcon.active();
    
    let title = properties.name;
    if (properties.annotation) title = properties.annotation;

    phThumbLink.data = null;
    phThumbLink.setAttribute("src", config.tracker.thumbsPath + properties.name);
    phThumbLink.setAttribute("title", title);
    phThumbLink.setAttribute("href", config.tracker.photosPath + properties.name);
}

function clusterOut(event) {
    console.log("clusterOut", event);
    if(clusterSticky) return;

    lastIcon.inactive();

    phThumbLink.setAttribute("href", "");
    phThumbLink.setAttribute("src", "");
    phThumbLink.setAttribute("title", "");
    phThumbLink.data = null;
}

function loggedIn(event) {
    phThumbLink.setAttribute("edit", event.detail.admin);
}

function changeDates(event) {
   phDialog.setAttribute("startdate", event.detail.start);
   phDialog.setAttribute("enddate", event.detail.end);
   broadcastFilteredPoints(event.detail.start, event.detail.end);
}
