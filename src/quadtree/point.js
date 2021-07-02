export default class Point {
	constructor(latitude, longitude, z) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.properties = {};
		this.z = z;
	}
	
	setId(id) {
		this.id = id;
	}
	
	getId() {
		return this.id;
	}
	
	getLatitude() {
		return this.latitude;
	}

	getLongitude() { 
		return this.longitude;
	}

	getZ() { 
		return this.z;
	}
	
	put(key, value) {
		this.properties[key] = value;
	}

	getProperties() {
		return this.properties;
	}
	
	toString() {
		let str = Object.keys(this.properties).reduce(key => {
            return key + "=" + this.properties[key] + ", "
        }, "Point (id, prop(s), lat/lng/z): " + id + ", ");
        
        str += this.getLatitude() + "/" + this.getLongitude();
		
		if(this.z && this.z != 0) {
            str += "/" + this.z;
		}
		return str; 
	}
	
	toGeoJson() {
		let coordinates = [this.longitude, this.latitude];
		if(this.z || this.z == 0) {
			coordinates.push(this.z);
		}

		return {
            type: "Point",
            coordinates
        };
	}
	
	toFeature() {
		let response = {
            type: "Feature",
            geometry: this.toGeoJson(),
            properties: this.properties
        };
		if(this.id) {
			response["id"] =  id;
		}
		return response;
	}
}
