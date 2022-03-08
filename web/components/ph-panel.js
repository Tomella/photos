const template = document.createElement('template');

template.innerHTML = `
<style>
.panel {
   flex-direction: column;
   border: 1px solid #dadce0;
   border-radius: 8px;
   position: relative;
   overflow-anchor: none;
   margin: 20px;
   padding-left: 20px;
}
</style>

<div class="panel">
   <slot></slot>
</div>
`;

customElements.define('ph-panel', class PanelElement extends HTMLElement {
   static get observedAttributes() { return ['expanded']; }


   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector)
   }

   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
   }


});
