import { createBboxFromPoints, expandBbox } from "./geojson2d.js";

export class Extent2d {
   static AUSTRALIA = new Extent2d(113, -44, 154, -10);
   static WORLD = new Extent2d(-180, -90, 180, 90);
   static REVERSE_WORLD = new Extent2d(180, 90, -180, -90);

   #extent = [];

   constructor(lngMin = -180, latMin = -90, lngMax = 180, latMax = -90) {
      this.#extent = [lngMin, latMin, lngMax, latMax];
   }

   get lngMin() {
      return this.#extent[0];
   }

   get latMin() {
      return this.#extent[1];
   }

   get lngMax() {
      return this.#extent[2];
   }

   get latMax() {
      return this.#extent[3];
   }

   set(extent) {
      this.#extent = [extent.lngMin, extent.latMin, extent.lngMax, extent.latMax];
      return this;
   }

   setFromPoints(points) {
      this.#extent = createBboxFromPoints(points);
      return this;
   }

   expand(point) {
      expandBbox(this.#extent, point);
      return this;
   }

   toBbox() {
      // Clone it.
      return [this.lngMin, this.latMin, this.lngMax, this.latMax];
   }

   clone() {
      return new Extent2d().set(this);
   }
}
