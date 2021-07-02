export default class TileInfoResponse {
	constructor(query) {
        this.tileInfos = [];
		this.query = query;
	}	
	
	add(item) {
		this.tileInfos.push(item);
	}
	
	getExtent() {
		return TileInfo.extent(this.tileInfos);
	}
	
	getTileInfos() {
		return this.tileInfos;
	}
	
	getQuery() {
		return this.query;
	}
	
	isMatchedDepth(depth) {
		return depth === this.query.getDepth();
	}
	
	within(intersector) {
		return this.query.intersects(intersector);
	}
}
