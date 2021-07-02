import Point from "./point.js";
import Request from "./request.js";
import TileHash from "./tilehash.js";


export default class PointRequest extends Request {

	constructor(x, y, zoom, startIndex = null, maxCount = null) {
		super(zoom, startIndex, maxCount);
		this.x = +x;
		this.y = +y;
	}
	
	getPoint() {
		return new Point(this.y, this.x);
	}

	static hashToQuery(x, y = null, z = null) {
        let hashStr = (y != null && z != null) ? z + "/" + x + "/" + y : x;
     	let hash = new TileHash(hashStr);
		let center = hash.toBbox().getCenter();

		return new PointRequest(center.getLongitude(), center.getLatitude(), hash.getZ());
	}

	getX() {
		return this.x;
	}

	setX(x) {
		this.x = x;
	}

	getY() {
		return this.y;
	}

	setY(y) {
		this.y = y;
	}
}
