export default {
   map: {
      id: "mapId",
      showLatLon: true,
      options: {
         center: [-34.454, 138.81],
         minZoom: 4,
         zoom: 12,
         maxZoom: 17
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
   },
   listUrl: "all",
   featuresUrl: "all",
   tracker: {
      url: "all",
      thumbsPath: "photos/thumbs/",
      photosPath: "photos/",
      count: 2100,
      colors: [
         "#ff7800",
         "#00ff78",
         "#7800ff",
         "#f72ace",
         "#cbf72a",
         "#f72a2a",
         "#2a9bf7",
         "#ff0000",
         "#fffb00",
         "#fcfce6"
      ],
      clusters: {
         url: "clusters",
      }
   },
   controls: {
      id: "controls"
   }
};
