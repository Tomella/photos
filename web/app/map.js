import L from "/lib/latlon.js";

export default class Map {
   constructor(config) {
      this.config = config;
   }
   create() {
      let config = this.config;
      this.map = L.map(config.id, config.options);

      if (config.showLatLon) {
         L.control.mousePosition({
            position: "bottomleft",
            emptyString: "",
            seperator: " ",
            latFormatter: function (lat) {
               return "Lat " + L.Util.formatNum(lat, 5) + "°";
            },
            lngFormatter: function (lng) {
               return "Lng " + L.Util.formatNum(lng % 180, 5) + "°";
            }
         }).addTo(this.map);
      }
      
      config.layers.forEach(layer => {
         this.addLayer(layer);
      });

      this.map.on("click", e => console.log("I", e));
   }

   addLayer(config) {
      let layer = L[config.type](config.url, config.options);
      layer.addTo(this.map);
      return layer;
   }

   addPoint(point, pan = false) {
      let marker = L.marker(point).addTo(this.map);
      if(pan) {
         this.map.setView(point);
      }
      return marker;
   }
}
