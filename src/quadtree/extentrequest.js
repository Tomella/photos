import Request from "./request.js";

export default class ExtentRequest extends Request {
	
	constructor(xmin, xmax, ymin, ymax, zoom) {
		super(zoom, null, null);
		this.xmax = +xmax;
		this.ymax = +ymax;
		this.xmin = +xmin;
		this.ymin = +ymin;
		
		this.zoom = +zoom;
	}

	getXmin() {
		return this.xmin;
	}

	setXmin(xmin) {
		this.xmin = xmin;
	}

	getXmax() {
		return this.xmax;
	}

	setXmax(xmax) {
		this.xmax = xmax;
	}

	getYmin() {
		return this.ymin;
	}

	setYmin(ymin) {
		this.ymin = ymin;
	}

	getYmax() {
		return this.ymax;
	}

	setYmax(ymax) {
		this.ymax = ymax;
	}
}
