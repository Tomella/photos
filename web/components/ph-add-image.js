
const template = document.createElement('template');

template.innerHTML = `<style>
input {
    border: none;
    color: black;
    padding: 5px 10px;
    text-decoration: none;
    display: inline-block;
    margin: 2px -3px 2px 4px;
    cursor: pointer;
    border-radius: 10px 0 0  10px;
}

button {
    background-color: white;
    border: 2px solid rgb(0,0,0,0.2);
    border-radius: 10px 10px 0 0;
    border-bottom: 0;
    font-weight: bold;
    color: black;
    padding: 10px 14px 10px 11px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin:  4px 2px 0 0;
    cursor: pointer;
    z-index: 2;
}

.hide {
    display: none;
}

iframe {
    z-index: 1;
    background-color: white;
    border-radius: 0 10px 10px 10px;
    border: 2px solid rgb(0,0,0,0.2);
    padding: 0;
}

.container {
    z-index: 1;
    position: relative;
}
</style>
<div class="container">
    <div class="narrow" title="Click to add photos">
        <button class="button">Add Photos</button>
    </div>
    <iframe class="hide" width="650" height="350"></iframe>
</div>
`;

customElements.define('ph-add-image', class AddImage extends HTMLElement {

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


        this._show = false;
        this.$("button").addEventListener("click", event => {
            this.show = !this._show;
        });
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr]();
    }

    set show(val) {
        this._show = val;
        let iframe = this.$("iframe");
        if(val) {
            if(!iframe.src) {
                iframe.src = "/add";
            }

            iframe.classList.remove("hide");
        } else {
            iframe.classList.add("hide");
        }

    }
    
    get show() {
        return this._show;
    }
});
