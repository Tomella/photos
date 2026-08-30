import { toCanvas } from "/thirdparty/qrcode.js";

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
   border: 2px solid gray;
   border-radius: 6px;
   background-color: white;
   right: 0;
   top: 0;

 }
</style>
<span role="button" class="btn">
   <svg fill="#ffffff" width="36" version="1.1" 
         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
         viewBox="-30 0 460 512" xml:space="preserve">
      <g stroke-width="2"> 
         <path d="M392.344,0H119.658c-15.681,0-28.438,12.757-28.438,28.438v155.793c0,15.681,12.757,28.438,28.438,28.438h77.683 c4.434,0,8.04,3.606,8.04,8.04v262.853c0,15.681,12.757,28.438,28.438,28.438h44.362c15.681,0,28.438-12.757,28.438-28.438v-3.942 c0-4.434,3.607-8.04,8.04-8.04h25.792c15.681,0,28.438-12.757,28.438-28.438v-17.385c0-15.681-12.757-28.438-28.438-28.438H314.66 c-4.434,0-8.04-3.606-8.04-8.04s3.607-8.04,8.04-8.04h25.792c15.681,0,28.438-12.757,28.438-28.438v-17.385 c0-15.681-12.757-28.438-28.438-28.438H314.66c-4.434,0-8.04-3.606-8.04-8.04v-78.229h0c0-4.434,3.606-8.04,8.04-8.04h77.683 c15.681,0,28.438-12.757,28.438-28.438V28.438C420.782,12.757,408.025,0,392.344,0z M314.66,327.376h25.792 c4.434,0,8.04,3.607,8.04,8.04v17.385c0,4.434-3.606,8.04-8.04,8.04H314.66c-15.681,0-28.438,12.757-28.438,28.438 s12.757,28.438,28.438,28.438h25.792c4.434,0,8.04,3.606,8.04,8.04v17.385c0,4.434-3.606,8.04-8.04,8.04H314.66 c-15.681,0-28.438,12.757-28.438,28.438v3.942c0,4.434-3.606,8.04-8.04,8.04h-44.363c-4.434,0-8.04-3.606-8.04-8.04V336.696 l60.443-60.443v22.685C286.222,314.62,298.979,327.376,314.66,327.376z M400.384,184.231c0,4.434-3.606,8.04-8.04,8.04H314.66 c-15.681,0-28.438,12.757-28.438,28.438v26.696l-60.443,60.443V220.71c0-15.681-12.757-28.438-28.438-28.438h-77.683 c-4.434,0-8.04-3.606-8.04-8.04V28.438c0-4.434,3.606-8.04,8.04-8.04h272.686c4.434,0,8.04,3.606,8.04,8.04V184.231z"></path> </g> </g> <g> <g> <path d="M354.868,48.068h-3.824c-5.632,0-10.199,4.567-10.199,10.199s4.567,10.199,10.199,10.199h3.824 c5.632,0,10.199-4.567,10.199-10.199S360.5,48.068,354.868,48.068z"></path> </g> </g> <g> <g> <path d="M314.993,48.068H157.134c-5.632,0-10.199,4.567-10.199,10.199s4.567,10.199,10.199,10.199h157.859 c5.632,0,10.199-4.567,10.199-10.199S320.625,48.068,314.993,48.068z"></path> </g> </g> <g> <g> <path d="M354.868,95.043H157.134c-5.632,0-10.199,4.567-10.199,10.199c0,5.632,4.567,10.199,10.199,10.199h197.733 c5.632,0,10.199-4.567,10.199-10.199C365.066,99.611,360.5,95.043,354.868,95.043z"></path> </g> </g> <g> <g> <path d="M354.868,142.018H157.134c-5.632,0-10.199,4.567-10.199,10.199c0,5.632,4.567,10.199,10.199,10.199h197.733 c5.632,0,10.199-4.567,10.199-10.199C365.066,146.585,360.5,142.018,354.868,142.018z"></path>      </g> 
   </svg>
</span>
`;

customElements.define('ph-key', class KeyIconElement extends HTMLElement {

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector)
   }

   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
   }

   connectedCallback() {
      /*
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
      */
   }
});
