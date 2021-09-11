import loader from "../lib/loader.js";
import config from "./config.js";
import Keyword from "./keyword.js";
import Viewer from "./viewer.js";
import LocalTime from "../lib/localtime.js";

let intv = null;
let period = 250;

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
let entry = urlSearchParams.get("keyword");
if (entry) document.querySelector("#album-title").innerHTML = entry;

const keyword = new Keyword(config.keyword);
const viewer = new Viewer(config.viewer);

window.onload = async (el) => {
   if (!entry) {
      keyword.show();
      return;
   }

   let response = await loader("/albumService/keyword" + window.location.search);
   period += response.length;
   let container = document.querySelector("al-image-container");

   response.forEach((feature, idx) => {
      // Temporal convenience
      feature.localTime = new LocalTime(feature.time_point);

      let image = document.createElement("al-image");
      image.onload = counter;
      image.setAttribute("src", config.thumbsPath + feature.filename);
      if (feature.annotation) {
         image.setAttribute("caption", feature.annotation);
      }

      image.title= feature.localTime.longStr;
      container.appendChild(image);


      image.addEventListener("click", el => {
         viewer.show(idx);
         container.setAttribute("hidden", true);
      });
   });
   window.onresize = update;

   let map = document.querySelector("ph-map");
   viewer.initialise(response);
   viewer.onClose(() => {
      container.removeAttribute("hidden");
      map.setAttribute("hidden", "hidden");
   });

   document.addEventListener("map-toggle", ev => {
      if(map.hasAttribute("hidden")) {
         map.removeAttribute("hidden");
         let index = +ev.target.getAttribute("index");
         let photo = response[index];
         map.setAttribute("latlon", photo.latitude + "," + photo.longitude);
      } else {
         map.setAttribute("hidden", "hidden");
      }
   });

   document.addEventListener("download", ev => {
      let index = +ev.target.getAttribute("index");
      let photo = response[index];
      console.log("PHOTO", photo)
      window.location = "/download/" + photo.filename;
   });

   document.addEventListener("photo-change", ev => {
      if(!map.hasAttribute("hidden")) {
         let index = +ev.target.getAttribute("index");
         let photo = response[index];
         map.setAttribute("latlon", photo.latitude + "," + photo.longitude);
      }
   });
}

function counter(ev) {
   if (intv) {
      return;
   }
   period += 10;

   intv = setTimeout(update, period);
}

function update() {
   console.log("updating...");
   document.querySelector("al-image-container").update();
   intv = null;
}
