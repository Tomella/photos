export default class SummaryResponse {
	
	getPoint() {
		return this.point;
	}
	
	setPoint(point) {
		this.point = point;
	}
	
	getResponse() {
		return this.response;
	}
	
	setResponse(response) {
		this.response = response;
	}
	
	pointClone() {
		let sr = new SummaryResponse();
		sr.setPoint(this.getPoint());
		return sr;
	}
    
    isEmpty() {
		return false;
	}

	getTilehash() {
		return this.tilehash;
	}

	setTilehash(tilehash) {
		this.tilehash = tilehash;
	}
}
