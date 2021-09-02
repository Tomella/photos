import loader from "../lib/loader.js";
import config from "./config.js";
import Keyword from "./keyword.js";
import Viewer from "./viewer.js";


let intv = null;
let period = 10;


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
      let image = document.createElement("al-image");
      image.onload = counter;
      image.setAttribute("src", config.thumbsPath + feature.filename);
      if (feature.annotation) {
         image.setAttribute("caption", feature.annotation);
      }
      container.appendChild(image);

      image.addEventListener("click", el => {
         viewer.show(idx);
         container.setAttribute("hidden", true);
      });
   });
   window.onresize = update;

   viewer.initialise(response);

   viewer.onClose(() => {
      container.removeAttribute("hidden");
   });

}

function counter(ev) {
   console.log(ev);
   period += 10;
   if (intv) {
      return;
   }

   intv = setTimeout(update, period);
}

function update() {
   console.log("updating...");
   document.querySelector("al-image-container").update();
   intv = null;
}
