const template = document.createElement('template');

template.innerHTML = `
<style>
.box{
    float: left;/* Set each photo box as a floating element to float all the pictures to the first line of the page*/
    padding: 5px;
}
.box-img{
    width: 256px;
    padding: 5px;
    border: 1px solid #ccc;
    box-shadow: 0 0 5px #ccc;
    border-radius: 5px;
}
.box-img img {
    width: 100%;
    height: auto;
}
.caption {
    font-family: "URW Chancery L", cursive;
    font-size: 90%;
}
</style>
<div class="box">
    <div class="box-img">
        <a>
            <img>
        </a>
        <div class="caption" hidden></div>
    </div>
</div>
`;

customElements.define('al-image', class AlbumImage extends HTMLElement {
    static get observedAttributes() { return ['src', 'href', 'title', 'caption']; }

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

    _caption() {
        let caption = this.getAttribute("caption");
        let element = this.$(".caption");
        
        element.innerHTML = caption;
        if(caption) {
            element.hidden = false;
        } else {
            element.hidden = true;
        }
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
