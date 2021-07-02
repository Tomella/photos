import Filters from "./filters.js";

export default class Request extends Filters {
    properties = new Set();

	Request(zoom, startIndex, maxCount) {
		this.maxCount = +maxCount;
		this.startIndex = +startIndex;
		this.zoom = +zoom;
	}
	
	getMaxCount() {
		return this.maxCount;
	}

	setMaxCount(maxCount) {
		this.maxCount = maxCount;
	}

	getStartIndex() {
		return this.startIndex;
	}

	setStartIndex(startIndex) {
		this.startIndex = startIndex;
	}

	getZoom() {
		return this.zoom;
	}

	setZoom(zoom) {
		this.zoom = zoom;
	}

	getProperties() {
		return this.properties;
	}
	
	setProperties(list) {
		if(list != null) {
            this.properties = Set();
            // This works for either a set or an array
            list.forEach(element => {
                this.properties.add(element);
            });
		}
	}
}
