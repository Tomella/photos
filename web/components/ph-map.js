import * as leaflet from "https://cdn.skypack.dev/leaflet";

const template = document.createElement('template');

class PhMap {
   constructor(config) {
      this.config = config;
   }
   create() {
      let config = this.config;
      this.map = L.map(config.id, config.options);

      config.layers.forEach(layer => {
         this.addLayer(layer);
      });

      this.map.on("click", e => console.log("I", e));
   }

   addLayer(config) {
      let layer = L.tileLayer(config.url, config.options);
      layer.addTo(this.map);
      return layer;
   }

   addPoint(point, pan = false) {
      let marker = L.marker(point).addTo(this.map);
      if (pan) {
         this.map.setView(point);
      }
      return marker;
   }
}

template.innerHTML = `
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
  crossorigin=""/>
<style>
#map {
   position: relative;
   width: 100%;
   height: 100%;
}
</style>
<div id="map"></div>
`;

customElements.define('ph-map', class PhotoMapElement extends HTMLElement {
   static get observedAttributes() { return ['latlon']; }

   static config = {
      options: {
         center: [-34.454, 138.81],
         minZoom: 5,
         zoom: 8,
         maxZoom: 15
      },
      layers: [
         {
            type: "tileLayer",
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: {
               maxZoom: 20,
               attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
               subdomains: ['a', 'b', 'c']
            }
         }
      ]
   };

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector)
   }

   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
      PhotoMapElement.config.id = this.$("#map");
   }

   _latlon() {
      let latlon = this.getAttribute("latlon");
      latlon = latlon ? latlon.split(",") : []
      if (latlon.length == 2) {
         this.draw(+latlon[0], +latlon[1]);
      } else {
         this.hidden();
      }
   }

   draw(lat, lon) {
      if (this.mapManager) {
         this.point.remove();
      } else {
         this.mapManager = new PhMap(PhotoMapElement.config);
         this.mapManager.create();
      }
      this.point = this.mapManager.addPoint([lat, lon], true);
   }

   hide() {
      this.$("#map").setAttribute("hidden", "hidden");
   }

   attributeChangedCallback(attr, oldValue, newValue) {
      this["_" + attr]();
   }
});
