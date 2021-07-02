export default class GeoJsonPoint {
	type = "Point";
	coordinates = [];
	
	constructor( geom) {
		this.coordinates[0] = geom.getLongitude();
		this.coordinates[1] = geom.getLatitude();
	}
	
	getCoordinates() {
		return this.coordinates;
	}
	
    getType() {
		return this.type;
	}
}
