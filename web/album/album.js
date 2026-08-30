import loader from "../lib/loader.js";
import config from "./config.js";
import Keyword from "./keyword.js";
import Viewer from "./viewer.js";
import LocalTime from "../lib/localtime.js";
import user from "/user.js";

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

   let { response, container } = await buildList(true);

   // Check if the user is an admin and show the add image control if so. Make sure to hide the add image control if the user is not an admin.  
   if (user.admin === 'Y') { // TODO: Change this to check for admin privileges in a more secure way, such as checking a token or session variable. 
      let addExpandImage = document.querySelector("al-expand-image");
      addExpandImage.setAttribute("admin", "true");
   } else {
      let addExpandImage = document.querySelector("al-expand-image");
      addExpandImage.removeAttribute("admin");
   }

   window.onresize = update;

   let map = document.querySelector("ph-map");
   viewer.initialise(response);
   viewer.onClose(() => {
      container.removeAttribute("hidden");
      map.setAttribute("hidden", "hidden");
      if (updateAfterDelete) {
         updateAfterDelete = false;
         counter();
      }
   });

   document.addEventListener("ondelete", ev => {
      console.log("Delete event received");
      let index = +ev.target.getAttribute("index");
      let photo = response[index];
      console.log("PHOTO", photo)
      let deleteModal = document.querySelector("#deletePhoto");
      deleteModal.open();

      let deleteYes = document.querySelector("#deletePhotoYes");
      let deleteNo = document.querySelector("#deletePhotoNo");
      deleteYes.addEventListener("click", handleDeleteYesClick);
      deleteNo.addEventListener("click", handleDeleteNoClick);
      deleteModal.addEventListener("dismiss", removeDeleteListeners);

      function handleDeleteYesClick() {
         deleteModal.close();
         console.log("TODO: Deleting photo");
         deletePhoto(photo);
      }

      function handleDeleteNoClick() {
         deleteModal.close();
      }

      function removeDeleteListeners() {
         console.log("Removing delete listeners");
         deleteYes.removeEventListener("click", handleDeleteYesClick);
         deleteNo.removeEventListener("click", handleDeleteNoClick);
         deleteModal.removeEventListener("dismiss", removeDeleteListeners);
      }

   });

   let updateAfterDelete = false;
   async function deletePhoto(detail) {
      //postMessage("info", "Deleting photo...", 10);
      console.log(detail);
      let response = await fetch(
         '/deleteService/' + detail.id
      );
      let data = await response.json();
      console.log("Delete response:", data);
      if(data.success) {
         console.log("success", "Photo deleted.", 6);
         let container = document.querySelector("al-image-container");
         viewer.remove(detail.id);
         container.removeImage(detail.id);
         updateAfterDelete = true;
      }
   }

   document.addEventListener("download", ev => {
      let index = +ev.target.getAttribute("index");
      let photo = response[index];
      console.log("PHOTO", photo)
      window.location = "/download/" + photo.filename;
   });

   document.addEventListener("photo-change", ev => {
      if (!map.hasAttribute("hidden")) {
         let index = +ev.target.getAttribute("index");
         let photo = response[index];
         map.setAttribute("latlon", photo.latitude + "," + photo.longitude);
      }
   });
}

async function buildList() {
   let response = await loader("/albumService/keyword" + window.location.search);
   period += response.length;
   let container = document.querySelector("al-image-container");

   response.forEach((feature, idx) => {
      // Temporal convenience
      feature.localTime = new LocalTime(feature.time_point);

      let image = document.createElement("al-image");
      image.setAttribute("data-id", feature.id);
      image.onload = counter;
      image.setAttribute("src", config.thumbsPath + feature.filename);
      if (feature.annotation) {
         image.setAttribute("caption", feature.annotation);
      }

      image.title = feature.localTime.longStr;
      container.appendChild(image);

      image.addEventListener("click", el => {
         viewer.show(feature.id);
         container.setAttribute("hidden", true);
      });
   });
   return { response, container };
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
