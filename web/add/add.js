import FileDrop from "../lib/filedrop.js";

let dropContainer = document.querySelector(".drop-container");

let files = [];
let names = {};
let rejected = 0;

const EXTENSIONS = ["image/jpeg"];
const clearBtn = document.querySelector(".clear-btn");
const submitBtn = document.querySelector(".submit-btn");



attachHandlers();


let fileDrop = new FileDrop(dropContainer, handler);
function handler(file) {
    console.log("EV", file);

    let type = EXTENSIONS.find(type => file.type == type && !names[file.name]);
    if (type) {
        names[file.name] = true;
        files.push(file);
        clearBtn.classList.remove("hide");
        submitBtn.removeAttribute("disabled");
    } else {
        rejected++;
    }
    message({
        value: "Added " + files.length + " and rejected " + rejected + " files" + " to list",
        type: "info"
    })


    console.log(files.length);
}


let phMessages = document.querySelector("ph-messages");

function message({ value, type, duration = 7 }) {
    // TODO We want to run an event driven message service.
    phMessages.setAttribute('value', value);
    phMessages.setAttribute('type', type);
    phMessages.setAttribute('duration', duration);
}

function attachHandlers() {
    clearBtn.addEventListener("click", (ev) => {
        message({
            value: "Removed all photos from list.",
            type: "info"
        });
        clearList();
    });

    submitBtn.addEventListener("click", async (ev) => {
        message({
            value: "Uploading files....",
            type: "info",
            duration: files.length * 2 + 5
        });
        await upload(files);
        message({
            value: "Files uploaded and scheduled for processing.",
            type: "success",
            duration: 7
        });

    });
}

function clearList() {
    files = [];
    rejected = 0;
    names = {};
    clearBtn.classList.add("hide");
    submitBtn.setAttribute("disabled", "disabled");
}

async function upload(files) {
    //FILL FormData WITH FILE DETAILS.
    var postData = new FormData();

    files.forEach(file => {
        postData.append("file", file);
    });


    let response = await fetch("/upload", {
        body: postData,
        method: 'POST',
        cache: 'no-cache'
    });
    clearList();
    let data = await response.json();
    return data
}
