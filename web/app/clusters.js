import loader from "../lib/loader.js";

const geojsonMarkerOptions = {
   radius: 5,
   fillColor: "#ff7800",
   color: "#000",
   weight: 1,
   opacity: 1
};

export default class Clusters {
   constructor(config, job, map) {
      this.config = {
         ...geojsonMarkerOptions,
         ...config
      };
      this.job = job;
      this.map = map;
   }

   async show(startDate, endDate) {
      let config = this.config;
      let url = this.config.url + "?startDate=" + 
      (startDate? startDate.toJSON().substr(0,10) : "") + "&endDate=" +
      (endDate? endDate.toJSON().substr(0,10) : "");
      
      let response = await loader(url);

      if (!this.last || this.last !== response.features[0].properties.name) {
         if (this.layer) this.layer.remove();

         // We want to reverse the features so lets shallow copy and reverse
         let count = response.features.length;
         let latest = response.features[0];
         this.last = latest.properties.name;

         this.layer = L.geoJSON(response, {
            pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
               ...this.config,
               fillOpacity: feature.properties.opacity,
               opacity: feature.properties.opacity
            })
        }).on("click", (e, a) => {  
            document.dispatchEvent(new CustomEvent('photoclick', {detail: e}));
        }).on("mouseover", (e, a) => {
            document.dispatchEvent(new CustomEvent('photoover', {detail: e}));
        }).on("mouseout", (e, a) => {
            document.dispatchEvent(new CustomEvent('photoout', {detail: e}));
        });
         this.layer.addTo(this.map)
         this.map.panTo(latest.geometry.coordinates.reverse());
         return true;
      } else {
         return false;
      }
   }

   stop() {
      clearTimeout(this.timeOut);
      this.layer.remove();
      delete this.last;
   }
}
