import TileHash from "./tilehash.js";
import TileInfo from "./tileinfo.js";

export default class HalfTileInfo extends TileInfo {

	constructor(zoom, x, y) {
        super()
		this.x = +x;
		this.y = +y;
		this.zoom = +zoom;
		this.initialise();
	}
	
	static fromZoomPoint(zoom, point) {
		let base = new TileInfo(point.latitude, point.longitude, zoom);
		// [ 136.58203125, -39.375, 136.93359375, -39.0234375 ]
		let box = base.getBbox();
		let xmin = box[0];
		let ymin = box[1];
		let xmax = box[2];
		let ymax = box[3];
		
		let halfWidth = xmax - xmin; 
		let dx = 0;
		
		if(point.longitude < xmin + halfWidth/2) {
			dx = -0.5;
		} else if(point.longitude > xmax - halfWidth/2) {
			dx = 0.5;
		}

		let dy = 0;		
		if(point.latitude < ymin + halfWidth/2) {
			dy = -0.5;
		} else if(point.latitude > ymax - halfWidth/2) {
			dx = 0.5;
		}
		
		return new HalfTileInfo(zoom, base.hash.x + dx, base.hash.y + dy);
	}

	initialise() {		
		this.tileInfos = [];
		
		this.westHalf = this.y != Math.floor(this.y);
		this.northHalf = this.x != Math.floor(this.x);
		
		if(!this.westHalf && !this.northHalf) {
			// This is your standard old single hash
			this.hash = new TileHash(this.zoom, Math.trunc(this.x), Math.trunc(this.y));
			this.tileInfos.push(new TileInfo(this.hash));
		} else { 
			let newZoom = this.zoom + 1;
			let llX = Math.trunc(this.x * 2.0);
			let llY = Math.trunc(this.y * 2.0);
			
			this.tileInfos.push(new TileInfo(new TileHash(newZoom, llX, llY)));
			this.tileInfos.push(new TileInfo(new TileHash(newZoom, llX + 1, llY)));
			this.tileInfos.push(new TileInfo(new TileHash(newZoom, llX, llY + 1)));
			this.tileInfos.push(new TileInfo(new TileHash(newZoom, llX + 1, llY + 1)));
		}
		let box = TileInfo.extent(this.tileInfos);
		this.geometry = box.toGeoJson();
		this.bbox = box.getGeoJsonBbox();
        this.id = this.tileInfos.map(info => info.id).join("-");
	}

	getProperties() {
        return {hash: this.getHalfHash()};
	}
	
	getTileHashes() {
        return this.tileInfos.map(info => info.id);
	}
	
	getHalfHash() {
        return {
            x: this.x,
            y: this.y,
            z: this.zoom
        };
	}
}
