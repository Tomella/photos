
const template = document.createElement('template');

template.innerHTML = `
<style>
.ph-thumb-image-container {
   position: relative;
}
</style>
<div class="ph-thumb-image-container">
   <div>
     <a target="ph-thumb-image" class="ph-thumb-image"><img class="ph-thumb-img"></img></a>
   </div>
</div>
`;

customElements.define('ph-thumb-image', class ThumbImage extends HTMLElement {
   static get observedAttributes() { return ['src', 'href', 'title']; }

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector);
   }

   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
   }

   connectedCallback() {
      //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
   }

   _href() {
      let href = this.getAttribute("href");
      let target = this.$(".ph-thumb-image");
      target.setAttribute("href", href);
      target.focus();
      console.log("focus set.");
   }

   _src() {
      let src = this.getAttribute("src");
      this.$(".ph-thumb-img").setAttribute("src", src);
   }

   _title() {
      let title = this.getAttribute("title");
      this.$(".ph-thumb-image-container").setAttribute("title", title);
   }

   set data(value) {

   }

   attributeChangedCallback(attr, oldValue, newValue) {
      this["_" + attr]();
   }
});
