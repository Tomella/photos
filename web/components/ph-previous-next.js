
const template = document.createElement('template');

template.innerHTML = `
<style>
.ph-previous-next {
    position: relative;
    padding:5px;
}

.ph-next {
    position: absolute;
    right: 0;
    bottom:0;
    padding:15px;
}

.ph-previous {
    position: absolute;
    left: 0;
    bottom:0;
    padding:15px;
}

.thumbBtn {
    width:64px;
    border-radius: 4px;
}

.thumbBtn img {
    width:100%;
}

.hide {
    display: none;
}

a:hover {
    cursor:pointer;  
}
</style>
<div class="ph-previous-next">
    <a class="ph-previous hide" title="Edit previous photo"><button class="thumbBtn"><img class="previous-image"></img>&lt;&lt;</button></a>
    <a class="ph-next hide" title="Edit next photo"><button class="thumbBtn"><img class="next-image"></img>&gt;&gt;</button></a>
</div>
`;
let timeout = null;

customElements.define('ph-previous-next', class PreviousNext extends HTMLElement {

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    $$(selector) {
        return this.shadowRoot && this.shadowRoot.querySelectorAll(selector)
    }

    constructor() {
        // Do something with the arguments
        super();
        // Normally you are adding the template
        const root = this.attachShadow({ mode: 'open' })
        root.appendChild(template.content.cloneNode(true));
    }

    set previous(data) {
        let container = this.$(".ph-previous");
        this._next = data;
        this.$(".previous-image").src = data.thumbPath;
        container.href = data.url;
        container.classList.remove("hide");
    }

    set next(data) {
        let container = this.$(".ph-next");
        this._previous = data;
        this.$(".next-image").src = data.thumbPath;
        container.href = data.url;
        container.classList.remove("hide");
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr]();
    }
});
