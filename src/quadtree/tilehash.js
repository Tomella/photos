import Bbox from "./bbox.js";
import Point from "./point.js";

export default class TileHash {
	static createRootLeft() {
		return new TileHash(0, 0, 0);		
	}

	static createRootRight() {
		return new TileHash(0, 1, 0);		
	}
    
    constructor(z, x = null, y = null) {
        if(x === null && y == null) {
            this.fromString(z);
        } else {
		    this.x = x;
		    this.y = y;
            this.z = z;
		}
	}

	createCorner(corner) {
		let z = this.getZ() + 1;
		let y = this.getY() * 2 + corner.getY();
		let x = this.getX() * 2 + corner.getX();
		return new TileHash(z, x, y);
	}


	/**
	 * The reverse of the toString and the geohash.
	 * 
	 * @param hash
	 */
	fromString(hash) {
		let parts = hash.split("/");
		if(parts.length == 3) {
			this.z = +parts[0];
			this.x = +parts[1];
			this.y = +parts[2];
		}
	}

	isAncestor(child) {
        let deltaZ = this.z - child.z; 
        
		if(deltaZ < 1) { 
			return false;
		}
		let isSameX = this.x >> deltaZ;
		let isSameY = this.y >> deltaZ;
		return isSameX == child.x && isSameY == child.y;
	}

	getZ() {
		return this.z;
	}

	setZ(z) {
		this.z = z;
	}

	getY() {
		return this.y;
	}

	setY(y) {
		this.y = y;
	}

	getX() {
		return this.x;
	}

	setX(x) {
		this.x = x;
	}

	toString() {
		return this.z +"/" + this.x + "/" + this.y;
	}
 
	toBbox() {
		let width = 180 / (1 << this.z);
		let halfWidth = width / 2; 
		
		let lat = this.y * width + halfWidth - 90.0;
		let lon = this.x * width + halfWidth - 180.0;
		return new Bbox(new Point(lat, lon), halfWidth);
	}
}
