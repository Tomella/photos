import Bbox from "./bbox.js";
import Point from "./point.js";
import TileHash from "./tilehash.js";

export default class TileInfo {
	static TYPE = "Feature";
	type = this.TYPE;
	
	constructor(hashLat, lon, zoom) {
		if(!arguments.length) return;

        if(!zoom) {
            this.prepareData(hashLat);
        } else {
            let xFromOrigin = lon + 180.0;
            let yFromOrigin = lat + 90.0;
            
            let xNumberOfTiles = 2 << zoom; // Level 0 is a 1x2 tiles;
    
            let halfWidth = 180 / (1.0 * xNumberOfTiles); // The width
            let tileWidth = halfWidth * 2;
            
            let x = Math.floor(xFromOrigin / tileWidth); // x tile number
            let y = Math.floor(yFromOrigin / tileWidth); // y tile number

            
            let hash = new TileHash(zoom, Math.trunc(x), Math.trunc(y));
            this.prepareData(hash);
        }
    }

    getProperties() {
		return {hash: this.hash};
	}
	
	prepareData(hash) {
		let bbox = hash.toBbox();
		this.geometry = bbox.toGeoJson();
		this.bbox = bbox.getGeoJsonBbox();
		this.id = hash.toString();
		this.hash = hash;
	}
	
	getType() {
		return this.type;
	}

    setType(type) {
		this.type = type;
	}

	getGeometry() {
		return this.geometry;
	}

	setGeometry(geometry) {
		this.geometry = geometry;
	}

	getId() {
		return this.id;
	}

	setId(id) {
		this.id = id;
	}

	getBbox() {
		return this.bbox;
	}

	setBbox(bbox) {
		this.bbox = bbox;
	}

	getHash() {
		return this.hash;
	}

	setHash(hash) {
		this.hash = hash;
	}

	toJSON() {
		return {
			type: TileInfo.TYPE,
			geometry: this.geometry,
			id: this.id,
			bbox: this.bbox,
			hash: this.hash,
			properties: this.properties
		};
	}

	static intersected(latMin, latMax, lonMin, lonMax, zoom) {
		let response = {
            type: "FeatureCollection"
        };		
		
		let tileInfos = [];
		
		let ll = new TileInfo(latMin, lonMin, zoom).hash;
		let ur = new TileInfo(latMax, lonMax, zoom).hash;
		
		for(let x = ll.getX(); x <= ur.getX(); x++) {
			for(let y = ll.getY(); y <= ur.getY(); y++) {
				tileInfos.push(new TileInfo(new TileHash(zoom, x, y)));
			}
		}
		response.features = tileInfos;
		return response;
	}
	
    static extent(tileInfos) {
		if(tileInfos.length == 0) {
			return null;
		}
		
		let maxX = -200;
		let maxY = -200;
		let minX = 200;
        let minY = 200;
        tileInfos.forEach(tileInfo => {
			let hash = tileInfo.hash.toBbox();
			maxX = Math.max(maxX, hash.getX2());
			minX = Math.min(minX, hash.getX1());
			maxY = Math.max(maxY, hash.getY2());
			minY = Math.min(minY, hash.getY1());
        });
		return new Bbox(
			new Point(minY, minX),
			new Point(maxY, maxX)
		);
	}
}
