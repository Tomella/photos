const template = document.createElement('template');

template.innerHTML = `
<style>
    label {
        display: inline-block;
        width: 10em;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .form-field input {
        width:25em;
    }
</style>
<div class="form-field">
    <label for="name" id="field_name"></label>
    <input type="text" id="form_input" name="name" required> <span class="error">This field is required!</span>
</div>`;



customElements.define('ph-form-field', class Messages extends HTMLElement {
    static get observedAttributes() { return ['key', 'label']; }

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

    _label() {
        let label = this.getAttribute("label");
        let element = this.$("#field_name");

        console.log("GG", label, element);
        element.innerHTML = label;
    }

    _key() {
        this._check();
    }

    get data() {
        return this._data;
    }

    set data(newVal) {
        this._data = newVal;
        this._check();
    }

    _check() {
        let data = this._data;
        let key = this.getAttribute("key");
        if (data && key) {
            this.$("#form_input").value = data[key];
        }
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr]();
    }
});
