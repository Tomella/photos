import PointsDecorator from "./pointsdecorator.js";

export default class TileHashesQueryResponse extends PointsDecorator {
	constructor(query) {
		super();
		this.query = query;
		this.points = [];
	}
	
	isAncestor(tileHash) {
        return !!this.query.tileHashes.find(hash => {
            return hash.isAncestor(tileHash);
        });
	}
	
	matches(tileHash) {
        return this.query.tileHashes.find(hash => hash.equals(tileHash));
	}

	getQuery() {
		return this.query;
	}

	setQuery(query) {
		this.query = query;
	}
}
