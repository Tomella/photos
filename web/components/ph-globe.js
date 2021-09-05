const template = document.createElement('template');

template.innerHTML = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" width="27"
height="28" stroke="#ffffff" fill="none">
<path stroke-width="26"
d="M209,15a195,195 0 1,0 2,0z"/>
<path stroke-width="18"
d="m210,15v390m195-195H15M59,90a260,260 0 0,0 302,0 m0,240 a260,260 0 0,0-302,0M195,20a250,250 0 0,0 0,382 m30,0 a250,250 0 0,0 0-382"/>
</svg>
`;

customElements.define('ph-globe', class GlobeElement extends HTMLElement {
   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
   }
});
