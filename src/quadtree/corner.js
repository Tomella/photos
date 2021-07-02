export default class Corner {
	static LOWER_LEFT = new Corner(0, 0);
	static UPPER_LEFT = new Corner(0, 1);
	static LOWER_RIGHT = new Corner(1, 0);
	static UPPER_RIGHT = new Corner(1, 1);
	
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	getY() {
		return this.y;
	}
	
	getX() {
		return this.x;
	}
}
