export default class Icon {
   VIEWING_CLASS = "marker-cluster-viewing"

   constructor(layer) {
       this.layer = layer;
   }

   active() {
       if(this.layer) {
           let div = this.layer._icon;
           if(div) div.classList.add(this.VIEWING_CLASS);
       }
   }

   inactive() {
       if(this.layer) {
           let div = this.layer._icon;
           if(div) div.classList.remove(this.VIEWING_CLASS);
       }
   }
}
