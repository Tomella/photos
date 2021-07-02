import Map from "./map.js";
import config from "./config.js";
import Tracker from "./tracker.js";

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
tracker.track();

let phDialog = document.querySelector("ph-dialog");
let phThumbLink = document.querySelector("ph-thumb-link");
let phMessages = document.querySelector("ph-messages");

phDialog.addEventListener("change", (e) => {
   tracker.filter(e.detail);
});

phThumbLink.addEventListener("close", (e) => {
    clusterSticky = false;
    clusterOut();
});

document.addEventListener("clusterclick", clusterClick);
document.addEventListener("clusterover", clusterOver);
document.addEventListener("clusterout", clusterOut);
document.addEventListener("message", message);

document.addEventListener("keyup", function(evt) {
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        clusterSticky = false;
        clusterOut();
    }
});

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
    
    phThumbLink.data = null;
    phThumbLink.setAttribute("src", config.tracker.thumbsPath + properties.name);
    phThumbLink.setAttribute("title", properties.name);
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
/* An example of dispatching a message into the message panel
setTimeout(() => {
    document.dispatchEvent(new CustomEvent("message", {
        detail: {
            type: "error",
            value: "Testing",
            duration: 5
        }
    }));
},4000);
*/
