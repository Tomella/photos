import Point from "../quadtree/point.js";

export default class PhotoPoint extends Point {
    constructor(geojson) {
        let latitude = geojson.geometrey.coordinates[1];
        let longitude = geojson.geometrey.coordinates[0];
        let properties = geojson.properties;
        let z = properties.elevation;
        super(latitude, longitude, z);
        super.properties = properties;
        this.setId(properties.id);
    }
}
