import Bbox from "./bbox.js";
import Query from "./query.js";

export default class BboxQuery extends Query {
	
	constructor(lowerLeft, upperRight) {
		super();
		this.lowerLeft = lowerLeft;
		this.upperRight = upperRight;
		this.bbox = new Bbox(lowerLeft, upperRight);
	}	
	
	getLowerLeft() {
		return this.lowerLeft;
	}
	
	getUpperRight() {
		return this.upperRight;
	}
	
	getBbox() {
		return this.bbox;
	}

	getPoint() {
		return this.bbox.getCenter();
	}

	intersects(intersector) {
		return this.bbox.intersects(intersector);
	}
}
