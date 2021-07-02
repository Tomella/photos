import Query from "./query.js";

export default class PointQuery extends Query {
	
	getPoint() {
		return this.point;
	}
    
    setPoint(point) {
		this.point = point;
	}

	getDepth() {
		return this.depth;
    }
    
	setDepth(depth) {
		this.depth = depth;
	}
	
	intersects(box) {
		let lonMin = box.getX1();
		let lonMax = box.getX2();
		let latMin = box.getY1();
		let latMax = box.getY2();
		
		return this.point.latitude >= latMin && this.point.latitude <=latMax &&
				this.point.longitude >= lonMin && this.point.longitude <= lonMax;
	}
}
