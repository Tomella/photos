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
   }

   show(idx) {
      this.container.removeAttribute("hidden");
      this.container.setAttribute("index", idx);
      document.querySelector("body").classList.add("viewer");
   }

   hide() {
      this.container.setAttribute("hidden", "hidden");
      document.querySelector("body").classList.remove("viewer");
   }

   onClose(fn) {
      this.#closeFns.push(fn);
   }
}
