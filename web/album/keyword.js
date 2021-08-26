export default class KeywordManager {
    constructor(config) {
        this.config = config;

        this.container = document.querySelector(config.container);
        this.closeButton = this.container.querySelector(".select-close");
        this.heading = document.querySelector(config.heading);
        this.filter = document.querySelector(config.filter);

        this.heading.onclick = ev => this.show();
        this.closeButton.onclick = ev => this.hide();
        this.filter.addEventListener("keyup", (ev) => this._filter(ev));
        this.fetch();
    }

    _filter(ev) {
        console.log("EVV:", ev, this.filter.value);
        let filter =  this.filter.value;
        if (ev.key !== 'Enter') {
            let els = document.querySelector(this.config.keywords).querySelectorAll("ph-keyword");
            let up = filter.toUpperCase();
            els.forEach(el => {
                let show = filter.length == 0 || el.innerText.toUpperCase().indexOf(up) > -1;
                let classList = el.classList;
                if(show){
                    classList.remove("hide");
                } else {
                    classList.add("hide");
                }
            });
        }
    }

    show() {
        this.container.classList.add('show');
        this.closeButton.disabled = false;
        this.heading.disabled = "disabled";
    }

    hide() {
        this.container.classList.remove('show');
        this.closeButton.disabled = "disabled";
        this.heading.disabled = false;
    }

    async fetch() {
        let target = document.querySelector(this.config.keywords);
        let response = await fetch('/keywords/all');
        let data = await response.json();
        let fmt = Intl.NumberFormat("EN-AU");

        target.innerHTML = "";

        target.addEventListener("keywordclick", (ev) => {
            console.log("A Keyword clicked.....",ev)
            ev.stopPropagation();
            window.location = this.config.redirect + ev.detail.value;
        });


        data.forEach(datum => {
            let el = document.createElement("ph-keyword");
            el.title = "Click to add keyword to current photo."
            el.innerText = datum.name + " (" + fmt.format(datum.count) + ")";
            el.value = datum.id;
            el.key = datum.name;
            target.appendChild(el);
        });
    }


}
