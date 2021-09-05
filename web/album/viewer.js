export default class Viewer {
   #closeFns = [];
   constructor(config) {
      this.config = config;
   }

   initialise(data) {
      this._data = data;
      let container = this.container = document.querySelector("al-expand-image");

      container.setAttribute("base", this.config.photosPath);
      container.setAttribute("thumbbase", this.config.thumbsPath);
      container.data = data;
      container.addEventListener("close", (ev) => {
         this.hide();
         this.#closeFns.forEach(fn => {
            fn();
         });
      });

      
      container.addEventListener("map-toggle", ev => {
         console.log("Map toggle", ev);
      });
   }

   show(idx) {
      this.container.removeAttribute("hidden");
      this.container.setAttribute("index", idx);
   }

   hide() {
      this.container.setAttribute("hidden", "hidden");
   }

   onClose(fn) {
      this.#closeFns.push(fn);
   }
}
