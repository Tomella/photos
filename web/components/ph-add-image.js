
const template = document.createElement('template');

template.innerHTML = `
<style>
.ph-messages {
    position: absolute;
    left:0;
    opacity: 0.8;
    text-align: center;
    font-size: 110%;
    padding:5px;
    border: 2px solid rgb(0,0,0,0.2);
    background-clip: padding-box;
    border-radius: 4px;
    transition: width 2s;
}

.ph-messages-transition {
    width:0;
}

.ph-messages-hide {
    width:0;
    padding:0;
    border:0;
}

.ph-messages-error > .ph-messages-type::before {
    content: "❌";
}

.ph-messages-info > .ph-messages-type::before {
    content: "💭";
}

.ph-messages-warn > .ph-messages-type::before {
    content: "❕";
}

.ph-messages-warn {
    background-color: LightGoldenRodYellow;
}
.ph-messages-error {
    background-color: lightpink;
}
.ph-messages-info {
    background-color: lightblue;
}
</style>
<span class="ph-messages">
    <span class="ph-messages-type"></span>
    <span class="ph-messages-text"></span>
</span>
`;
let timeout = null;

customElements.define('ph-add-image', class AddImage extends HTMLElement {
    static get observedAttributes() { return ['value', 'type', 'duration']; }

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

    _value() {
        let value = this.getAttribute("value");
        console.log("value here:", value);
        this.$(".ph-messages-text").innerHTML = value;
    }

    _type() {
        let type = this.getAttribute("type");
        console.log("type here:", type);
        this._setClass(type);
    }

    _duration() {
        let duration = this.getAttribute("duration");
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            this._clear();
        }, (+duration) * 1000);
    }

    _clear() {
        timeout = null;
        this.setAttribute("type", "");
        this.setAttribute("value", "");
        this._setClass("hide");
    }

    _setClass(name) {
        let type = this.$(".ph-messages");
        type.classList.remove("ph-messages-hide");
        type.classList.remove("ph-messages-warn");
        type.classList.remove("ph-messages-info");
        type.classList.remove("ph-messages-error");
        if(name) {
            type.classList.add("ph-messages-" + name);
        } else {
            type.classList.add("ph-messages-hide");
        }
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr]();
    }
});
