import fetch from 'node-fetch';

export default class Elevation {
    constructor(template) {
        this.template = template;
    }

    async atPoint(lat, lng) {
        const url = this.template.replace("$lat", lat).replace("$lng", lng);
        // console.log(url);
        const res = await fetch(url);
        const json = await res.json();

        return json && json["HEIGHT AT LOCATION"] && !isNaN(+json["HEIGHT AT LOCATION"]) ? +json["HEIGHT AT LOCATION"] : null;
    }
}