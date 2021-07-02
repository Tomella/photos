export default class Eventmanager {
    constructor(events = {}) {
        Object.keys(events).forEach(key => {
            this.events[key] = events[key] ? events[key] : [];
            document.add
        });
    }

}
