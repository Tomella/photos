import PointsDecorator from "./pointsdecorator.js";

export default class PointResponse extends PointsDecorator {
	constructor(query) {
        super();
        if(query) {
            this.query = query;
            this.addFilters(query.getFilters());
		}
		console.log("query", query)
	}
	
	within(intersector) {
		try {
		console.log(this.query)
		return this.query.intersects(intersector);
		} catch(e) {
			console.log("Why?", e)
		}
	}

	isMatchedDepth(depth) {
		return depth == this.query.getDepth();
	}
	
	getQuery() {
		return this.query;
	}
	
	setQuery(query) {
		this.query = query;
	}
}
