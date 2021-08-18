export default class AddImageCtl {
    constructor(element) {
        this._element = element;
    }

    show() {
        this._element.classList.remove("hide");
    }

    hide() {
        this._element.classList.add("hide");
    }
}
