import {toCanvas} from "/thirdparty/qrcode.js";

const template = document.createElement('template');

template.innerHTML = `
<style>
.close {
   position: absolute;
   top: -3px;
   right: 5px;
   font-size: 28px;
   font-weight: bold;
   z-index: 3;
 }
 
 .close:hover,
 .close:focus {
   color: #444;
   text-decoration: none;
   cursor: pointer;
 }

 img {
   cursor: pointer;
    width: 50%;
    height: 50%;
 }

 .panel {
   box-shadow: 0 0 20px #ddd;
    position: relative;
    padding: 10px;
   border: 2px solid black;
   border-radius: 6px;
   background-color: white;
   right: 0;
   top: 0;

 }
</style>
<span role="button" class="btn"><img src="/thirdparty/qrcode-icon.png"></span>
<div hidden="hidden" class="panel">
   <span role="button" class="close cursor">×</span>
   <canvas></canvas>
</div>
`;

customElements.define('qr-code', class QRCodeElement extends HTMLElement {
   
   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector)
  }
   
   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
   }

   connectedCallback() {
      var canvas = this.$('canvas')
      console.log(window.QRCode)
      toCanvas(canvas, "" + window.location, function (error) {
         if (error) console.error(error)
         console.log('success!');
      })

      let close = this.$(".close");
      let panel = this.$(".panel");
      let button = this.$(".btn");
      button.addEventListener("click", (ev) => {
         button.setAttribute("hidden", "hidden");
         panel.removeAttribute("hidden");
      });

      close.addEventListener("click", ev => {
         button.removeAttribute("hidden");
         panel.setAttribute("hidden", "hidden");
      });
   }
});
