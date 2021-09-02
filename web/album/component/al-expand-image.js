const template = document.createElement('template');

template.innerHTML = `
<style>
  /* Number text (1/3 etc) */
  .numbertext {
    color: #f2f2f2;
    font-size: 12px;
    padding: 8px 12px;
    position: absolute;
    top: 0;
  }
  
  /* The Modal (background) */
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
  
  /* Modal Content */
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
  
  /* The Close Button */
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
  
  /* Hide the slides by default */
  .mySlides {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom:40px;
  }
  
  /* Next & previous buttons */
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
  
  /* Position the "next button" to the right */
  .next {
    right: 0;
    border-radius: 3px 0 0 3px;
  }
  
  /* On hover, add a black background color with a little bit see-through */
  .prev:hover,
  .next:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* Caption text */
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
   static get observedAttributes() { return ['index', 'base', 'thumbbase', 'hidden']; }

   #index = null

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector);
   }

   $$(selector) {
      return this.shadowRoot && this.shadowRoot.querySelectorAll("*")
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
         let prev = this.#index - 1;
         if(prev < 0) {
            prev = this._data.length - 1;
         }
         this.setAttribute("index", prev);
      });

      this.$(".next").addEventListener("click", (ev) => {
         console.log("NEXT", ev);
         let next = (this.#index + 1) % this._data.length;
         this.setAttribute("index", next);
      });
   }

   connectedCallback() {
      //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
   }

   set data(data) {
      this._data = data;
   }

   _index() {
      let idx = this.#index = +this.getAttribute("index");
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
         photo.onload = (ev) => {
            thumb.setAttribute("hidden", true);
            photo.removeAttribute("hidden");
         }
      }

      target.appendChild(photo);

      this.$(".caption-container").innerHTML = feature.annotation ? feature.annotation : "";
      this.$(".numbertext").innerHTML = (idx + 1) + " / " + this._data.length;
   }

   _base() {
      // Nothing to do yet
   }

   _thumbbase() {
      // Nothing to do yet
   }

   _hidden() {
      let hidden = this.hasAttribute("hidden");
      this.$(".modal").hidden = !!hidden;
   }

   attributeChangedCallback(attr, oldValue, newValue) {
      this["_" + attr]();
   }
});
