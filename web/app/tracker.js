import Points from "./points.js";

export default class Tracker {
   constructor(config, map) {
      this.config = config;
      this.map = map;
      this.colorIndexLength = config.colors.length;
      this.colorIndex = -1;
   }

   track(options) {
      let track = this.stop();
      if(!track) {
         this.colorIndex = ++this.colorIndex % this.colorIndexLength;
         track = this.tracked = new Points({...this.config,
            fillColor: this.config.colors[this.colorIndex]}, name, this.map);
      }
      track.show();
   }

   stop() {
      if(this.tracked) {
         this.tracked.stop();
      }
      return this.tracked;
   }

   filter({startDate, endDate}) {
      let track = this.stop();
      if(track) {
         track.show(startDate, endDate);
      }
   }
}
