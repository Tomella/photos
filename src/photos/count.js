export default class Count {
	getCount() {
		return this.count;
	}

	setCount(count) {
		this.count = count;
	}

	constructor(count = null) {
		this.count = count;
	}
	
	static isEmpty(count) {
		return count == null || 
				count.getCount() == null ||
				count.getCount() == 0;
	}
}
