const template = document.createElement('template');

template.innerHTML = `
<style>
  .numbertext {
    color: #f2f2f2;
    font-size: 12px;
    padding: 8px 12px;
    position: absolute;
    top: 0;
  }
  
  .modal {
    position: absolute;
    z-index: 1;
    padding-top:0px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: none;
    background-color: black;
  }
  
  .modal-content {
    position: relative;
    top: 0;
    bottom: 0;
    margin: auto;
    padding: 0;
    width: 90%;
    height: 100%;
    max-width: 1200px;
  }
  
  .close {
    color: white;
    position: absolute;
    top: 10px;
    right: 25px;
    font-size: 35px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: #999;
    text-decoration: none;
    cursor: pointer;
  }
  
  .mySlides {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom:40px;
  }
  
  .no-caption {
     bottom: 0;
  }

  .prev,
  .next {
    cursor: pointer;
    position: absolute;
    top: 50%;
    width: auto;
    padding: 16px;
    margin-top: -50px;
    color: white;
    font-weight: bold;
    font-size: 20px;
    transition: 0.6s ease;
    border-radius: 0 3px 3px 0;
    user-select: none;
    -webkit-user-select: none;
  }
  
  .next {
    right: 0;
    border-radius: 3px 0 0 3px;
  }
  
  .prev:hover,
  .next:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .caption-container {
     position: absolute;
     left: 0;
     right: 0;
    text-align: center;
    padding: 10px;
    color: white;
    bottom: 0px;
  }
</style>
<div id="myModal" class="modal">
   <span class="close cursor">×</span>
   <div class="modal-content">
      <div class="numbertext"></div>
      <div class="mySlides" style="display: block;"></div>
    
      <a class="prev">❮</a>
      <a class="next">❯</a>
   </div>
   <div class="caption-container"></div>
</div>
`;

customElements.define('al-expand-image', class AlbumExpandImage extends HTMLElement {
   static get observedAttributes() { return ['index', 'hidden']; }

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector);
   }

   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
      this.modal = this.$("#myModal");

      this.$(".close").addEventListener("click", (ev) => {
         const event = new CustomEvent('close', {
            bubbles: true,
            composed: true
         });
         this.dispatchEvent(event);
      });

      this.$(".prev").addEventListener("click", (ev) => {
         let prev = +this.getAttribute("index") - 1;
         if(prev < 0) {
            prev = this._data.length - 1;
         }
         this.setAttribute("index", prev);
      });

      this.$(".next").addEventListener("click", (ev) => {
         console.log("NEXT", ev);
         let next = (+this.getAttribute("index") + 1) % this._data.length;
         this.setAttribute("index", next);
      });
   }

   set data(data) {
      this._data = data;
   }

   _index() {
      let idx = +this.getAttribute("index");
      let feature = this._data[idx];
      let target = this.$(".mySlides");

      target.innerHTML = "";
      
      let photo = document.createElement("img");
      let base = this.getAttribute("base");

      photo.setAttribute("src", base + feature.filename);

      if(this.hasAttribute("thumbbase")) {
         let thumb = document.createElement("img");
         let thumbBase = this.getAttribute("thumbbase");
         thumb.setAttribute("src", thumbBase + feature.filename);
         target.appendChild(thumb);
         photo.setAttribute("hidden", true);
         photo.setAttribute("title", "Taken " + feature.localTime.longStr + " (local time).")
         photo.onload = (ev) => {
            thumb.setAttribute("hidden", true);
            photo.removeAttribute("hidden");
         }
      }

      target.appendChild(photo);

      let annotation = feature.annotation ? feature.annotation : "";
      if(!annotation) {
         target.classList.add("no-caption");
      } else {
         target.classList.remove("no-caption");
      }
      this.$(".caption-container").innerHTML = annotation;

      this.$(".numbertext").innerHTML = (idx + 1) + " / " + this._data.length;
   }

   _hidden() {
      let hidden = this.hasAttribute("hidden");
      this.$(".modal").hidden = !!hidden;
   }

   attributeChangedCallback(attr, oldValue, newValue) {
      this["_" + attr]();
   }
});
