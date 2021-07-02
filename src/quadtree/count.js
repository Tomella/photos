export default class Count {
	count = null;
	
	getCount() {
		return this.count;
	}

	setCount(count) {
		this.count = count;
	}

	constructor(count) {
		this.count = count;
	}
	
	static isEmpty(count) {
		return count == null || 
				count.getCount() == null ||
				count.getCount() == 0;
	}
}
