import Filters from "./filters.js";

export default class PointsDecorator extends Filters {
	
	constructor() {
		super();
		this.points = [];
	}
	
	filter(candidates = []) {
        //console.log("Adding " + points.size() + " to " + this.points.size());
        candidates.forEach(point => {
			if(this.matches(point.getProperties())) {
				this.points.push(point);
			}				
        });
	}
	
	add(point) {
		this.points.push(point);
	}
	
	getPoints() {
		return this.points;
	}
}
