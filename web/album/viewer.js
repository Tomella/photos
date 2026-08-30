export default class Viewer {
   #closeFns = [];
   constructor(config) {
      this.config = config;
   }

   initialise(data) {
      this._data = data;
      this.lastId = data.length ? data[0].id : null;
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

   remove(id) {
      let index = this._data.findIndex(photo => photo.id === id);
      this._data.splice(index, 1);
      this.hide();
      if(this._data.length) {
         let i = index >= this._data.length ? 0 : index;
         this.show(this._data[i].id);
      } 
   }

   show(id = this.lastId) {
      let index = this._data.findIndex(photo => photo.id === id);
      this.container.removeAttribute("hidden");
      this.container.setAttribute("index", index);
      document.querySelector("body").classList.add("viewer");
      this.lastId = id;
   }

   hide() {
      this.container.setAttribute("hidden", "hidden");
      document.querySelector("body").classList.remove("viewer");
   }

   onClose(fn) {
      this.#closeFns.push(fn);
   }
}
