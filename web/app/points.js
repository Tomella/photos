import loader from "../lib/loader.js";

const geojsonMarkerOptions = {
   radius: 5,
   fillColor: "#ff7800",
   color: "#000",
   weight: 1,
   opacity: 1
};

export default class Points {
   constructor(config, job, map) {
      this.config = {
         ...geojsonMarkerOptions,
         ...config
      };
      this.job = job;
      this.map = map;
   }

   async show(result) {
      let options = {
         showCoverageOnHover: true,
         zoomToBoundsOnClick: true,
         singleMarkerMode: true,
         animate: true
      };

      options.iconCreateFunction = function (cluster) {
         let childCount = cluster.getAllChildMarkers().length;
         let c = ' marker-cluster-';
         if (childCount < 10) {
            c += 'small';
         } else if (childCount < 50) {
            c += 'medium';
         } else {
            c += 'large';
         }
         return new L.DivIcon({
            html: '<div><span class="marker-cluster-count">' + Number(childCount).toLocaleString() + '</span></div>',
            className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)
         });
      };

      this.layer = L.markerClusterGroup(options).on("click", (e, a) => {
         document.dispatchEvent(new CustomEvent('clusterclick', { detail: e }));
      }).on("mouseover", (e, a) => {
         document.dispatchEvent(new CustomEvent('clusterover', { detail: e }));
      }).on("mouseout", (e, a) => {
         document.dispatchEvent(new CustomEvent('clusterout', { detail: e }));
      });
      
      result.features.forEach(cell => {
         let x = cell.geometry.coordinates[1];
         let y = cell.geometry.coordinates[0];
         let xy = [x, y];
         let marker = L.marker(xy, cell.properties);
         this.layer.addLayer(marker);
      });
      this.layer.addTo(this.map);
   }

   stop() {
      clearTimeout(this.timeOut);
      this.layer.remove();
      delete this.last;
   }
}
