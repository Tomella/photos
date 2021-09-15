import Points from "./points.js";

export default class Tracker {
   constructor(config, map) {
      this.config = config;
      this.map = map;
      this.colorIndexLength = config.colors.length;
      this.colorIndex = -1;
   }

   track(data) {
      let track = this.stop();
      if(!track) {
         this.colorIndex = ++this.colorIndex % this.colorIndexLength;
         track = this.tracked = new Points({...this.config,
            fillColor: this.config.colors[this.colorIndex]}, name, this.map);
      }
      track.show(data);
   }

   stop() {
      if(this.tracked) {
         this.tracked.stop();
      }
      return this.tracked;
   }

   show(data) {
      let track = this.stop();
      if(track) {
         track.show(data);
      }
   }
}
