const template = document.createElement('template');

template.innerHTML = `
    <style>
        #form-container {
            width:38em; 
            padding:10px; 
            background-color:white;
            opacity: 0.8;
            border-radius:4px;
        }

        label {
            width: 18em;
            font-weight: bold;
            display: inline-block;
        }

    </style>
    <div id="form-container">
        <input type="hidden" name="id" /> 
        <div class="form-field">
            <label for="filename">File Name </label>
            <span name="filename"></span> 
        </div>
        <div class="form-field">
            <label for="created">Creation Date </label>
            <span type="text" name="created"></span> 
        </div>
        <div class="form-field">
            <label for="description">Description </label>
            <span type="text" name="description"></span> 
        </div>
        <div class="form-field">
            <label title="Add an annotation that describes this photo. Limit is 2,000 characters. You can type more but it will be truncated." 
                    for="annotation" style="vertical-align:top">
                    Annotation 
            </label>
            <textarea name="annotation" rows="3" cols="27"></textarea> 
            <button name="save-annotation" style="vertical-align: top;">Save</button>
        </div>
        <div class="form-field">
            <label for="latlong">Latitude / Longitude (degrees)</label>
            <span name="latlong"></span>
        </div>
        <div class="form-field">
            <label for="elevation">Elevation (m) </label>
            <span name="elevation">
        </div>
        <div class="form-field">
            <label for="rotote-left" title="Create a thumbnail from the original image. It can be rotated 90 degrees in either direction, rotated 180 degrees or at the original orientation.">Generate Thumbnail</label>
            <button name="original">Shrink</button>
            <button name="rotate-left">Left</button>
            <button name="rotate-180">180 degrees</button>
            <button name="rotate-right">Right</button>
        </div>
    </div>
`;

customElements.define('ph-photo-form', class PhotoForm extends HTMLElement {

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector);
    }

    $name(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector("[name='" + selector + "']");
    }

    /*
    annotation: null
    description: "motorola moto g(7) power"
    elevation: 181.779
    filename: "IMG_20200420_153705064.jpg"
    id: 2608
    latitude: -34.427101
    longitude: 138.83714
    time_point: "2020-04-20T15:37:05.000Z"
    */
    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));

        /*
        <button name="original">Shrink</button>
        <button name="rotate-left">Left</button>
        <button name="rotate-180">180 degrees</button>
        <button name="rotate-right">Right</button>
        */
        this.$name("original").addEventListener("click", event => {
            broadcast("original", this._data);
        });
        this.$name("rotate-left").addEventListener("click", event => {
            broadcast("left", this._data);
        });
        this.$name("rotate-right").addEventListener("click", event => {
            broadcast("right", this._data);
        });
        this.$name("rotate-180").addEventListener("click", event => {
            broadcast("180", this._data);
        });
        this.$name("save-annotation").addEventListener("click", event => {
            this._data.annotation = this.$name("annotation").value;
            document.dispatchEvent(new CustomEvent('saveannotation', {detail: this._data}));
        });

        function broadcast(direction, data) {
            document.dispatchEvent(new CustomEvent('thumbrotate', {detail: {direction, data}}));
        }
    }

    set data(data) {
        this._data = data;
        let date = new Date(data.time_point);
        this.$name("id").value = data.id;
        this.$name("filename").innerHTML = data.filename;
        this.$name("created").innerHTML = date.toLocaleString('en-AU', { timeZone: 'UTC' });

        this.$name("description").innerHTML = data.description;
        this.$name("annotation").value = data.annotation;
        this.$name("latlong").innerHTML = data.latitude + "° / " + data.longitude + "°";
        this.$name("elevation").innerHTML = data.elevation + "m";
    }

    get data() {

    }

});
