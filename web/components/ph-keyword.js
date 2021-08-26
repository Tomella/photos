
const template = document.createElement('template');

template.innerHTML = `
<style>
.button {
    background-color: #ddd;
    border: none;
    color: black;
    padding: 5px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 10px;
  }
</style>
<button class="button"><slot></slot></button>
  `;

customElements.define('ph-keyword', class Keyword extends HTMLElement {
    static get observedAttributes() { return ['title', 'key']; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    constructor() {
        // Do something with the arguments
        super();
        // Normally you are adding the template
        const root = this.attachShadow({ mode: 'open' })
        root.appendChild(template.content.cloneNode(true));

        this.addEventListener("click", (ev) => {
            const event = new CustomEvent('keywordclick', {
                bubbles: true,
                composed: true,
                detail: { value: this._value ? this._value : this.innerText }
            });
            this.dispatchEvent(event);
        });
    }

    _title(a, b, c) {
        console.log("Val = ", a, b, c)
    }

    set key(val) {
        this._value = val;
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr]();
    }
});
