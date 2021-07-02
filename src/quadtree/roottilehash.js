import TileHash from "./tilehash.js";

export default class RootTileHash extends TileHash {
	constructor(z, x, y) {
		super(z, x, y);
	}
	
	createCorner(corner) {
		let z = this.getZ() + 1;
		let y = corner.getY();
		let x = this.getX() * 2 + corner.getX();
		return new TileHash(z, x, y);
	}
}
