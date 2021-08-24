export default class KeywordManager {
    constructor(config) {
        this.config = config;

        this.container = document.querySelector(config.container);
        this.closeButton = this.container.querySelector(".selectclose");
        this.heading = document.querySelector(config.heading);

        this.heading.onclick = ev => {
            this.container.classList.add('show');
            this.closeButton.disabled = false;
            this.heading.disabled = "disabled";
        };

        this.closeButton.onclick = ev => {
            this.container.classList.remove('show');
            this.closeButton.disabled = "disabled";
            this.heading.disabled = false;
        }

        this.fetch();
    }

    async fetch() {
        let target = document.querySelector(this.config.keywords);
        let response = await fetch('/keywords/all');
        let data = await response.json();
        target.innerHTML = "";

        target.addEventListener("keywordclick", (ev) => {
            console.log("A Keyword clicked.....",ev)
            ev.stopPropagation();
            window.location = this.config.redirect + ev.detail.value;
        });


        data.forEach(datum => {
            let el = document.createElement("ph-keyword");
            el.title = "Click to add keyword to current photo."
            el.innerText = datum.name;
            el.value = datum.id;
            target.appendChild(el);
        });
    }


}
