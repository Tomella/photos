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
  input {
      border-radius: 6px;
  }

  #container {
    max-width:fit-content; 
    opacity:0.8;
  }

  .hide {
      display: none;
  }
</style>
<div id="container" style="">

</div>
  `;

customElements.define('ph-keywords', class Keywords extends HTMLElement {
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

    set data(value = []) {
        this._filter = "";
        console.log("Getting keywords data")
        this._data = value;
        let container = this.$("#container");
        container.innerHTML = "";
        let adder = document.createElement("ph-keyword-add");
        container.appendChild(adder);

        adder.addEventListener("keywordchange", ({ detail }) => {
            this._filter = detail.value;
            this._applyFilter();
        });


        this.addEventListener("keywordclick", (ev) => {
            console.log("A Keyword clicked.....")
            ev.stopPropagation();
            const event = new CustomEvent('savekeyword', {
                bubbles: true,
                composed: true,
                detail: ev.detail
            });
            this.dispatchEvent(event);
        });


        this._data.forEach(datum => {
            let el = document.createElement("ph-keyword");
            el.title = "Click to add keyword to current photo."
            el.innerText = datum.name;
            el.value = datum.id;
            container.appendChild(el);
        });

    }

    _applyFilter() {
        let els = this.$$("ph-keyword");
        let up = this._filter.toUpperCase();
        els.forEach(el => {
            let show = this._filter.length == 0 || el.innerText.toUpperCase().indexOf(up) > -1;
            let classList = el.classList;
            if(show){
                classList.remove("hide");
            } else {
                classList.add("hide");
            }
        });
    }
});
