const template = document.createElement('template');

template.innerHTML = `
<style>
#container{
    position: relative;
}

img {
    width: 100%;
    height: 100%;
    object-fit: none;
    object-position: 5px 10%;
    border: 5px solid red;
  }
</style>
<div id="container">
    <img src="https://photos.geospeedster.com/photos/thumbs/IMG_20200309_120341578_HDR.jpg"></img>
</div>
`;

customElements.define('al-expand-image', class AlbumExpandImage extends HTMLElement {
    static get observedAttributes() { return ['src', 'href', 'title']; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector);
    }

    $$(selector) {
        return this.shadowRoot && this.shadowRoot.querySelectorAll("*")
    }

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
    }

    set data(data) {
        this._data = data;
    }



    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr]();
    }
});
