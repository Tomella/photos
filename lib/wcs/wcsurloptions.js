import { Extent2d } from "./extent2d.js";

export class WcsUrlOptions {
   constructor(options) {}

   get resolutionY() {
      return  this.options.resolutionY ? this.options.resolutionY : Math.round(this.options.resolutionX * (this.options.bbox[3] - this.options.bbox[1]) / (this.options.bbox[2] - this.options.bbox[0]));
   }

   set resolutionY(val) {
      this.options.resolutionY = val;
   }

   get resolutionX() {
      return this.options.resolutionX ? this.options.resolutionX : 500;
   }

   get template() {
      return this.options.template;
   }

   get bbox() {
      return this.options.bbox;
   }

   get extent() {
      return this.options.extent ? this.options.extent : Extent2d.WORLD;
   }

   get location() {
      return this.template
            .replace("${resx}", this.resolutionX)
            .replace("${resy}", this.resolutionY)
            .replace("${width}", this.resolutionX)
            .replace("${height}", this.resolutionY)
            .replace("${bbox}", this.bbox.join(","));
   }
}
