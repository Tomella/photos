const template = document.createElement('template');

template.innerHTML = `
<style>
#container{
    position: relative;
}
</style>
<div id="container"><slot></slot></div>
`;

customElements.define('al-image-container', class AlbumImageContainer extends HTMLElement {
    static get observedAttributes() { return ['src', 'href', 'title']; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector);
    }

    $$(selector) {
        return this.shadowRoot && this.shadowRoot.querySelectorAll("*")
    }

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
    }

    _href() {
        let href = this.getAttribute("href");
        let target = this.$(".ph-thumb-image");
        target.setAttribute("href", href);
        target.focus();
        console.log("focus set.");
    }

    _src() {
        let src = this.getAttribute("src");
        this.$("img").setAttribute("src", src);
    }

    _title() {
        let title = this.getAttribute("title");
        this.$("div").setAttribute("title", title);
    }

    set data(value) {

    }

    update() {
        console.log("Updating");
        // Take out all the contents under contained
        var images = this.querySelectorAll("al-image");

        //Get the fixed width we set for each image in css
        var imgWidth = images[0].width;
        console.log("Width: ", imgWidth)

        var columns = Math.floor(document.body.clientWidth / imgWidth); //Get the width of the browser body and calculate how many pictures we can put at most

        //Display pictures
        var boxHeightArr = [];
        images.forEach((el, i) => {
            el.style.position = el.style.top = el.style.left = 'initial';
            if (i < columns) {  //Let's fill the first row first
                boxHeightArr[i] = el.offsetHeight; //Here we store the height of each column through boxhightarr [] array
            } else { //For the rest of the images, we choose the one with the lowest height first
                var minHeight = Math.min(...boxHeightArr);
                var minIndex = boxHeightArr.findIndex(el => el === minHeight);

                //Finally, position our picture relative to the container box and put it under each column
                el.style.position = 'absolute';
                el.style.top = minHeight + 'px';
                el.style.left = images[minIndex].offsetLeft + 'px';
                boxHeightArr[minIndex] = boxHeightArr[minIndex] + el.offsetHeight;
            }
        });
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr]();
    }
});
