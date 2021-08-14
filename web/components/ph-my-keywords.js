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
</style>
<div id="container">

</div>
  `;

customElements.define('ph-my-keywords', class Keywords extends HTMLElement {

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
        this._data = data;
        let container = this.$("#container");
        container.innerHTML = "<b>Keywords</b>";
        value.forEach(datum => {
            let el = document.createElement("ph-keyword");
            el.innerText = datum.name;
            el.title = "Click to delete this keyword from photo.";
            el.value = datum.id;
            container.appendChild(el);
        });
    } 
});
