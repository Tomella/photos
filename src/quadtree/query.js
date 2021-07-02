import Filters from "./filters.js";

export default class Query extends Filters {
	depth = null

	constructor() {
		super();
	}

	getDepth() {
		return this.depth;
	}
	
	setDepth(depth) {
		this.depth = depth;
	}
}
