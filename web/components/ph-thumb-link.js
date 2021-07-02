
const template = document.createElement('template');

template.innerHTML = `
<style>
.ph-thumb-link-container {
   position: relative;
}
.ph-thumb-unstick {
   background-color: white;
   border-radius:10px;
   border-style: none;
   padding-top: 3px;
   opacity: 0.6;
}
.ph-dialog-heading {
   width:250px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}
</style>
<div class="ph-thumb-link-container">
   <button class="undecorated ph-thumb-unstick" style="position:absolute;right:0">X</button>
   <div>
     <a target="ph-thumb-link" class="ph-thumb-link"><img class="ph-thumb-img"></img></a>
     <div class="ph-dialog-heading"></div>
     <div class="ph-extra-info"></div>
   </div>
</div>
`;

customElements.define('ph-thumb-link', class ThumbLink extends HTMLElement {
   static get observedAttributes() { return ['src', 'href', 'title']; }

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector);
   }

   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
      this._title();
      this.$("button").addEventListener("click", (e) => {
         this.dispatchEvent(new CustomEvent('close', { detail: e }));
      });
   }

   connectedCallback() {
      //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
   }

   _href() {
      let href = this.getAttribute("href");
      let target = this.$(".ph-thumb-link");
      target.setAttribute("href", href);
      target.focus();
      console.log("focus set.");
   }

   _src() {
      let src = this.getAttribute("src");
      this.$(".ph-thumb-img").setAttribute("src", src);
   }

   _title() {
      let title = this.getAttribute('title');
      this.style.display = title ? "block" : "none";
      this.$(".ph-dialog-heading").innerHTML = title;
   }

   set data(value) {
      let info = this.$(".ph-extra-info");
      if (value) {
         info.innerHTML = `<strong>Timestamp: </strong>${value.time_point}<br/><strong>Make/Model: </strong>${value.description}`;
      } else {
         info.innerHTML = "";
      }
   }

   attributeChangedCallback(attr, oldValue, newValue) {
      this["_" + attr]();
   }
});
