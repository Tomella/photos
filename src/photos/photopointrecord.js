import Point from "../quadtree/point.js";
/**
 * In other languages we use sets for keys and values so we effectively tokenise them to save room 
 * (and run bigger data sets before running out of memory) The sets are static so say we had a 250 
 * character common value it is reduced to a single instance with references passed around.
 * 
 * At the moment, we don't care.
 */
export default class PhotoPointRecord extends Point {

	constructor(latitude, longitude, z) {
        super(latitude, longitude, z);
	}
}
