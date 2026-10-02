export default class Message {
    constructor(container) {
        this._container = container;
    }

    post(detail) {
        if(detail.clear) {
            return this.clear();
        }
        this._container.setAttribute('value', detail.value);
        this._container.setAttribute('type', detail.type);
        this._container.setAttribute('duration', detail.duration ? detail.duration : 7);
    }

    clear() {
        this._container.setAttribute('clear', Date.now());
    }
}
