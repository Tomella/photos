import imageInfo from "/lib/imageutils.js"

const template = document.createElement('template');
template.innerHTML = `
<style>
img {
   width: 100%;
   height: 100%;
   object-fit: contain;
   cursor: zoom-in;
}
div {
   height: 100%;
}
</style>
<div></div>
`;

customElements.define('al-magnify', class AlbumImageMagnify extends HTMLElement {
   static get observedAttributes() { return ['src', 'title']; }

   #onloads = [];
   #dimensions = {}

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector);
   }

   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
   }

   connectedCallback() {
      let cropper = this.$("img");
   }

   _src() {
      let scale = 1;
      let translate = {x: 0, y:0}

      let moving = false;
      let start = null

      let image = new Image();
      image.addEventListener("load", ev => {
         this.#dimensions.natural = {
            width: image.width,
            height: image.height
         };
         let div = this.$("div");
         
         div.appendChild(image);
         image.classList.add("fill");

         window.cropper = [image, div];

         console.log("fred", ev, image.width, image.height);
         this.#onloads.forEach(fn => {
            fn(ev);
         });
   
         image.addEventListener('dragstart', (ev) => {
            start = ev;
         });

         image.addEventListener('dragend', (ev) => {
            let dimensions = imageInfo(image);
            let circumstances = {preTransform: dimensions};
            let postTransform = circumstances.postTransform = {};

            moving = false;
            let changeX = ev.clientX - start.clientX;
            let changeY = ev.clientY - start.clientY;
            translate.x += changeX / scale;
            translate.y += changeY / scale;
   
            let translateStr = `translate(${translate.x}px,${translate.y}px)`;
            image.style.transform = `scale(${scale})` + " " + translateStr;
            
         
            this._decorateScaleDetails(postTransform, dimensions, scale, translate);
            console.log("Up", ev, circumstances);
            //window.t = {circumstances, image};
         });

         image.addEventListener("click", ev => {
            updatePhoto({
               x: ev.x,
               y: ev.y,
               deltaY: ev.ctrlKey ? 1 : -1
            })
         });

         image.addEventListener("wheel", ev => {
            updatePhoto(ev);
         });

         let updatePhoto = (ev) => {
            let dimensions = imageInfo(image);
            let circumstances = {preTransform: dimensions};
            let postTransform = circumstances.postTransform = {};

            scale -= 0.5 * Math.sign(ev.deltaY);
   
            scale = Math.max(1, scale);
            scale = Math.min(8, scale); 

            if (scale == 1) {
               translate.x = translate.y = 0;
            } else {
               let offsetX = (0.5 * dimensions.containerWidth - ev.x) * scale;
               let offsetY = (0.5 * dimensions.containerHeight - ev.y) * scale;
               console.log("Offset", offsetX, offsetY);
            }   
            let translateStr = `translate(${translate.x}px,${translate.y}px)`;

            // Apply scale transform
            image.style.transform = `scale(${scale})` + " " + translateStr;
         

            this._decorateScaleDetails(postTransform, dimensions, scale, translate);
            console.log("Wheel", ev, circumstances);
            //window.t = {circumstances, image};
         };
      });

      image.src = this.getAttribute("src");
   }

   _decorateScaleDetails(target, dimensions, scale, xY) {
      let center = {x: 0.5 * dimensions.containerWidth, y: 0.5 * dimensions.containerHeight};
      target.center = center;
      target.scale = scale;
      target.width = scale * dimensions.width;
      target.height = scale * dimensions.height;
      target.transX = xY.x * scale;
      target.transY = xY.y * scale; 
   }

   _title() {
      let title = this.getAttribute("title");
      this.$("div").setAttribute("title", title);
   }

   set onload(fn) {
      this.#onloads.push(fn);
   }

   get width() {
      return this.$("img").offsetWidth;
   }

   get offsetLeft() {
      return this.$("img").offsetLeft;
   }

   get offsetHeight() {
      return this.$("img").offsetHeight;
   }

   attributeChangedCallback(attr, oldValue, newValue) {
      this["_" + attr]();
   }
});
