const template = document.createElement('template');

template.innerHTML = `
<style>  
  /* Hide the slides by default */
  .mySlides {
    display: none;
  }
  
  
  /* On hover, add a black background color with a little bit see-through */
  .prev:hover,
  .next:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  /* Number text (1/3 etc) */
  .numbertext {
    color: #f2f2f2;
    font-size: 12px;
    padding: 8px 12px;
    position: absolute;
    top: 0;
  }
  
  /* Caption text */
  .caption-container {
    text-align: center;
    background-color: black;
    padding: 2px 16px;
    color: white;
  }
  
  img.demo {
    opacity: 0.6;
  }
  
  .active,
  .demo:hover {
    opacity: 1;
  }
  
  img.hover-shadow {
    transition: 0.3s;
  }
  
  .hover-shadow:hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
</style>
<div class="mySlides" style="display: block;">
   <div class="numbertext"><slot name="index"></slot> / <slot name="count"></slot></div>
   <img style="width:100%">
</div>`;


customElements.define('al-photo', class AlbumPhoto extends HTMLElement {
  static get observedAttributes() { return ['src', 'href', 'title', 'hidden']; }
  
  constructor() {

  }
});
