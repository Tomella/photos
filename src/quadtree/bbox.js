import Point from "./point.js";
import Corner from "./corner.js";

export default class Bbox {

	constructor(center = null, halfDistance = null) {
        if(center === null) return;

        if(typeof halfDistance !== "number") {
            this.boxFromPoints(center, halfDistance)
        } else {
            this.center = center;
            this.halfDistanceLat = this.halfDistanceLon = halfDistance;
        }
	}
	
	boxFromPoints(ll, ur) {
		console.log("What the!", ll, ur);
		let maxLat = ur.getLatitude();
		let minLat = ll.getLatitude();
		this.halfDistanceLat = (maxLat - minLat) / 2;
		
		let maxLon = ur.getLongitude();
		let minLon = ll.getLongitude();
		this.halfDistanceLon = (maxLon - minLon) / 2;
		this.center = new Point(minLat + this.halfDistanceLat, ll.getLongitude() + this.halfDistanceLon);
	}
	
	toString() {
		return "(" + (this.center.longitude - this.halfDistanceLon) + " deg, " +
				(this.center.latitude - this.halfDistanceLat) + " deg) - (" +
				(this.center.longitude + this.halfDistanceLon) + " deg, " +
				(this.center.latitude + this.halfDistanceLat) + " deg)";
	}
	createNw() {
		let box = new Bbox();
		let hd = box.halfDistanceLat = box.halfDistanceLon = this.halfDistanceLat * 0.5;
		box.center = new Point(this.center.latitude + hd, this.center.longitude - hd);
		return box;
	}
	
	createNe() {
		let box = new Bbox();
		let hd = box.halfDistanceLat = box.halfDistanceLon = this.halfDistanceLat * 0.5;
		box.center = new Point(this.center.latitude + hd, this.center.longitude + hd);
		return box;
	}
	
	createSw() {
		let box = new Bbox();
		let hd = box.halfDistanceLat = box.halfDistanceLon = this.halfDistanceLat * 0.5;
		box.center = new Point(this.center.latitude - hd, this.center.longitude - hd);
		return box;
	}

	createSe() {
		let box = new Bbox();
		let hd = box.halfDistanceLat = box.halfDistanceLon = this.halfDistanceLat * 0.5;
		box.center = new Point(this.center.latitude - hd, this.center.longitude + hd);
		return box;
	}

    createCorner(corner) {
		if(corner == Corner.LOWER_LEFT) {
			return this.createSw();
		} else if(corner == Corner.UPPER_LEFT) {
			return this.createNw();
		} else if(corner == Corner.LOWER_RIGHT) {
			return this.createSe();
		} else {
			return this.createNe();
		}
	}
	
	toGeoJson() {
		let polygon = [
            [this.getX1(), this.getY1()],
            [this.getX1(), this.getY2()],
            [this.getX2(), this.getY2()],
            [this.getX2(), this.getY1()],
            [this.getX1(), this.getY1()]
        ];
        
        return {
            type: "Polygon",
            coordinates: [polygon]
        };
	}
	
	
	getCenter() {
		return this.center;
	}
	
	containsPoint(point) {
		return this.center.latitude + this.halfDistanceLat >= point.latitude
				&& this.center.latitude - this.halfDistanceLat <= point.latitude
				&& this.center.longitude + this.halfDistanceLon >= point.longitude
				&& this.center.longitude - this.halfDistanceLon <= point.longitude;
	}
	
	/**
	 * Check if one bounding box intersects another bbox
	 * 
	 * @param s, abounding box.
	 * @return boolean true if intersects.
	 */
	intersects(r) {
		let s = this;
        return (r.getX2() >= s.getX1() && r.getY2() >= s.getY1() && s.getX2() >= r.getX1() && s.getY2() >= r.getY1());
	}

	getX1() {
		return this.center.longitude - this.halfDistanceLon;
	}
	
	getX2() {
		return this.center.longitude + this.halfDistanceLon;
    }
    
	getY1() {
		return this.center.latitude - this.halfDistanceLat;
    }
    
	getY2() {
		return this.center.latitude + this.halfDistanceLat;
	}
	
	getGeoJsonBbox() {
		return [this.getX1(), this.getY1(), this.getX2(), this.getY2()];
    }
		
	toJSON() {
		return {
		  	center : this.center,
			geoJsonBbox: this.getGeoJsonBbox()
		};
	}

	static createOrigin() {
		let origin = new Bbox();
		origin.halfDistanceLat = 180;
		origin.halfDistanceLon = 180;
		origin.center = new Point(0, 0);
		return origin;
	}
	
	static createLeft() {
		let left = new Bbox();
		left.halfDistanceLat = left.halfDistanceLon = 90;
		left.center = new Point(0, -90);
		return left;
	}
	
	static createRight() {
		let right = new Bbox();
		right.halfDistanceLat = right.halfDistanceLon = 90;
		right.center = new Point(0, 90);
		return right;
	}

}
