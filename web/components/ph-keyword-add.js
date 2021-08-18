
const template = document.createElement('template');

template.innerHTML = `
<style>
.container {
    width: 200px;
    white-space: nowrap;
}

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
    background-color: #DDDDDD;
    border-color: #DDDDDD;

    border: none;
    color: black;
    padding: 5px 9px 5px 6px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin:  0 4px 2px 0;
    cursor: pointer;
    border-radius: 0 10px 10px 0;
}

.input-append {
    margin-left: -1px;
}
</style>
<span class="container">
    <input type="text" placeholder="Add/Filter Keyword(s)"></input>
    <span class="input-append">
        <button class="button">+</button>
    </span>
</span>
  `;

customElements.define('ph-keyword-add', class KeywordAdd extends HTMLElement {
    static get observedAttributes() { return ['value']; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    constructor() {
        // Do something with the arguments
        super();
        // Normally you are adding the template
        const root = this.attachShadow({ mode: 'open' })
        root.appendChild(template.content.cloneNode(true));
        let inp = this.$("input");

        let clicked = (ev) => {
            console.log("CLICK EVV:", ev, inp.value);
            let val = inp.value;
            if(val) {
                const evt = new CustomEvent('savekeyword', {
                    bubbles: true,
                    composed: true,
                    detail: { value: inp.value }
                });
                this.dispatchEvent(evt);
            }
        }

        inp.addEventListener("keyup", (ev) => {
            console.log("EVV:", ev, inp.value);
            if (ev.key === 'Enter') {
                clicked(ev);
            } else {
                const evt = new CustomEvent('keywordchange', {
                    bubbles: true,
                    detail: { value: inp.value }
                });
                this.dispatchEvent(evt)
            }
        });
        
        let btn = this.$("button");
        btn.addEventListener("click", clicked);

    }
    
    _value(a, b, c) {
        console.log("Val = ", a, b, cs)
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr]();
    }
});
