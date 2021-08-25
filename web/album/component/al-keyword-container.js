const template = document.createElement('template');

template.innerHTML = `
<style>
    
</style>
<div id="select-album" onclick="document.querySelector('#keywordcontainer').classList.add('show')">
    <div class="select-label">Select Album...</div>
</div>
<div id="keyword-container">View Album</div>
`;

customElements.define('al-image', class AlbumImage extends HTMLElement {
    static get observedAttributes() { return ['src', 'href', 'title']; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector);
    }

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
    }

    _href() {
        let href = this.getAttribute("href");
        let target = this.$("a");
        target.setAttribute("href", href);
    }

    _src() {
        let src = this.getAttribute("src");
        let img = this.$("img");
        img.setAttribute("src", src);
    }

    _title() {
        let title = this.getAttribute("title");
        this.$("div").setAttribute("title", title);
    }

    get width() {
        return this.$(".box").offsetWidth;
    }

    get offsetLeft() {
        return this.$(".box").offsetLeft;
    }

    get offsetHeight() {
        return this.$(".box").offsetHeight;
    }

    set onload(fn) {
        this.$("img").onload = fn;
    }

    set data(value) {

    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr]();
    }
});
