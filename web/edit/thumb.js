/*
   <div id="thumb-link" class="thumb-image-container">
        <div>
          <img class="thumb-img"></img>
        </div>
     </div>
*/


export default class ThumbLink {

   $(selector) {
      return this.root && this.root.querySelector(selector);
   }

   constructor(root) {
       this.root = root
   }

   set src(val) {
      this.$(".thumb-img").src =  val;
   }

   set title(val) {
      this.$(".thumb-img").title = val;
   }

   get src() {
      return this.$(".thumb-img").src;
   }

   get title() {
      return this.$(".thumb-img").title;
   }
}
