const template = document.createElement('template');

template.innerHTML = `
<style>
.panel {
   border: 1px solid #dadce0;
   border-radius: 8px;
   margin: 20px;
   padding-left: 20px;
}
   
h2 {
    margin-top: 0px;
    margin-bottom: 8px;
    font-family: Fraunces, sans-serif;
    color: #101010;
    font-size: 32px;
    line-height: 1.1;
    font-weight: 400;
    letter-spacing: -0.035em;
}

a {
   display: -webkit-box;
   display: -webkit-flex;
   display: -ms-flexbox;
   display: flex;
   overflow: hidden;
   width: 100%;
   padding: 20px 28px;
   -webkit-box-align: center;
   -webkit-align-items: center;
   -ms-flex-align: center;
   align-items: center;
   border-radius: 14px;
   background-color: #f3eee9;
   -webkit-transition: -webkit-transform 150ms ease-in-out;
   transition: -webkit-transform 150ms ease-in-out;
   transition: transform 150ms ease-in-out;
   transition: transform 150ms ease-in-out, -webkit-transform 150ms ease-in-out;
   color: #101010;
   font-size: 16px;
   line-height: 1.5;
   text-decoration: none;
}

.icon-button {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    overflow: hidden;
    width: 36px;
    height: 36px;
    min-height: 36px;
    min-width: 36px;
    margin-left: auto;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 50px;
    background-color: #101010;
}
</style>

<a href="https://webflow.com/templates/html/links-app-website-template" class="inline-card w-inline-block">
   <h2 class="h3 margin-bottom-0">Purchase Link</h2>
   <div class="icon-button">
      <img src="https://assets.website-files.com/6012d939a7f34155b3f709eb/6012fabd4a4dcd745df3a0cb_arror-right-white.svg" loading="lazy" width="20" alt="White arrow pointing right" class="icon-button-image">
   </div>
</a>
`;

customElements.define('ph-panel', class PanelElement extends HTMLElement {
   static get observedAttributes() { return ['href', 'title', 'expanded']; }


   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector)
   }

   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
   }

   attributeChangedCallback(attr, oldValue, newValue) {
      this["_" + attr](newValue);
   }

   _title(title) {
      this.$('h2').innerHTML = title;
   }

   _href(href) {
      this.$('a').setAttribute('href', href);
   }
});
