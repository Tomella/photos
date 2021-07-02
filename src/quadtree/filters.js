export default class Filters {
	filters = {};
	
	addFilter(key = null, value = null) {
        if(!value) {
            if(key) {
                let pair = key.split("=");
                if(pair.length == 2) {
                    this.filters[pair[0]] = pair[1];
                }
            }
        } else {
            this.filters[key] = value;
        }
	}

	addFilters(filters = null) {
		if(filters != null) {
            if(Array.isArray(filters)) {
                filters.forEach(filter => this.addFilter(filter));
            } else {
                Object.assign(this.filters, filters);
            }
		}
	}

	getFilters() {
		return this.filters;
	}
	
	matches(values = {}) {
        let keys = Object.keys(this.filters);
        if(!keys.length) return true;   // We match everything. Is this redundant?
        if(!Object.keys(values).length) return false;

        let fail = keys.find(key => {
            let match = values[key];
            return !(!match || match != this.filters[key])
        });
		return !!fail;
	}
}
