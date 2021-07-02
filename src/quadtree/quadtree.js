import Bbox from "./bbox.js";
import Corner from "./corner.js";
import Count from "./count.js";
import Point from "./point.js";
import PointResponse from "./pointresponse.js";
import RootTileHash from "./roottilehash.js";
import TileInfo from "./tileinfo.js";

export default class QuadTree {
	points = [];

	static createLeft(config) {
		let response = this.quadTreeFactory(config, Bbox.createLeft());
		response.tilehash = new RootTileHash(0, 0, 0);
		return response;
	}

	static createRight(config) {
		let response = this.quadTreeFactory(config, Bbox.createRight());
		response.tilehash = new RootTileHash(0, 1, 0);
		return response;
	}
	
	/* 
	 * Only called locally from the static creators for left and right nodes from root.
	 */
	static quadTreeFactory(config, bbox) {
		let instance = new QuadTree();
		instance.depth = config.maxDepth;
		instance.config = config;
		instance.boundary = bbox;
		return instance;
	}

	constructor(parent, corner) {
		if(parent) {
			this.config = parent.config;
			this.depth = parent.depth - 1;
			this.tilehash = parent.tilehash.createCorner(corner);
			this.boundary = parent.boundary.createCorner(corner);
		}
	}
	
	query(query) {
		this.conditionalFlush();
		
		let response = new PointResponse(query);
		this.decoratePoints(response);
		return response;
	}
	
	decorateTileInfo(response) {
		this.conditionalFlush();
		if( response.within(this.boundary) ) {
			console.log("Intersects " + this.boundary);

			if(response.isMatchedDepth(this.depth)) {				
				console.log("Intersects " + this.boundary + " " + response.isMatchedDepth(this.depth));

				response.add(new TileInfo(this.tilehash));
			} else if(this.nw != null) {
				this.nw.decorateTileInfo(response);
				this.ne.decorateTileInfo(response);
				this.sw.decorateTileInfo(response);
				this.se.decorateTileInfo(response);
			}
		}
	}
	
	decoratePoints(point, filters = null) {
		if(filters) return this.decoratePointsFiltered(point, filters);

		this.conditionalFlush();
		if( point.within(this.boundary) ) {
			console.log("Intersects " + this.boundary);
			
			if(point.isMatchedDepth(this.depth)) {				
				console.log("Intersects " + this.boundary + " " + point.isMatchedDepth(this.depth));
				this.decorateWithAllChildren(point);
			} else if(this.nw != null) {
				this.nw.decoratePoints(point);
				this.ne.decoratePoints(point);
				this.sw.decoratePoints(point);
				this.se.decoratePoints(point);
			}
		}
	}
	
	decoratePointsFiltered(allPoints, filters) {
		if(this.points != null && this.points.length > 0) {
			this.points.forEach(point => {
				if(filters.matches(point.getProperties())) {
					allPoints.push(point);
				}
			});
		} else {
			if(this.nw != null) {
				this.nw.decoratePointsFiltered(allPoints, filters);
				this.ne.decoratePointsFiltered(allPoints, filters);
				this.sw.decoratePointsFiltered(allPoints, filters);
				this.se.decoratePointsFiltered(allPoints, filters);
			}
		}
	}
	matchTiles(response) {
		this.conditionalFlush();
		if( response.matches(this.tilehash) ) {
			this.decorateWithAllChildren(response);
		} else if(this.nw != null && response.isAncestor(this.tilehash)) {
			this.nw.matchTiles(response);
			this.ne.matchTiles(response);
			this.sw.matchTiles(response);
			this.se.matchTiles(response);
		}
	}
	
	decorateWithAllChildren(point) {
		point.filter(this.points);
		if(this.nw != null) {
			this.nw.decorateWithAllChildren(point);
			this.ne.decorateWithAllChildren(point);
			this.sw.decorateWithAllChildren(point);
			this.se.decorateWithAllChildren(point);
		}
	}

	querySummary(query) {
		let response = [];
		if( this.boundary.intersects(query.getBbox())) {
			this.conditionalFlush();
			if(query.getDepth() == this.depth) {
				let counts = this.createSummary(query);
				if(!counts.isEmpty()) {
					response.push(counts);
				}
			} else {
				// What do we do if we have to tunnel down
				if(this.nw != null) {
					response = this.nw.querySummary(query);
					response = response.concat(this.ne.querySummary(query), 
						this.sw.querySummary(query),
						this.se.querySummary(query));
				}
			}			
		}		
		return response;
	}
	
	createSummary(query) {
		let response = this.config.summaryFactory.createSummaryResponse(this.boundary.getCenter());
		let allPoints = [];
		this.decoratePoints(allPoints, query);

		response.setResponse(new Count(allPoints.length));
		response.setPoint(this.recalculatePoint(allPoints)); 
		response.setTilehash(this.tilehash);
		return response;		
	}
	
	recalculatePoint(points) {
		let lon = 0;
		let lat = 0;
		let z = null; // Not all data sets have z.
		
		points.forEach(point => {
			lon += point.getLongitude();
			lat += point.getLatitude();
			if(point.getZ() != null) {
				if(z == null) {
					z = 0;
				}
				z += point.getZ();				
			}
		});
		let length = points.length; // Make sure its a decimal.

		lon /= length;
		lat /= length;
		if(z != null) {
			z /= length;
		}
		
		return new Point(lat, lon, z);
	}
	
	insert(p) {
		// Ignore objects that do not belong in this quad tree
		if (!this.boundary.containsPoint(p)) {
			return false; // object cannot be added
		}
		
		// If there is space in this quad tree, add the object here
		if(this.nw == null && (this.points.length < this.config.pointsLength || this.depth == 0)) {	
			this.points.push(p);
			return true;
		}
		
		// Otherwise, subdivide and then add the point to whichever node will
		// accept it
		if (this.nw == null) {
			this.subdivide();
		}
		
		if (this.nw.insert(p)) {
			return true;
		}
		
		if (this.ne.insert(p)) {
			return true;
		}
		
		if (this.sw.insert(p)) {
			return true;
		}
		
		if (this.se.insert(p)) {
			return true;
		}

		console.log("Why have we got here!" );
		// Otherwise, the point cannot be inserted for some unknown reason (this
		// should never happen)
		return false;
	}
	
	conditionalFlush() {
		if(this.points.length > 0 && this.depth != 0) { 
			if(this.nw != null) {
				this.flush();
			} else {
				this.subdivide();
			}
		}
	}
	
	
	subdivide() {
		this.nw = new QuadTree(this, Corner.UPPER_LEFT);
		this.sw = new QuadTree(this, Corner.LOWER_LEFT);
		this.ne = new QuadTree(this, Corner.UPPER_RIGHT);
		this.se = new QuadTree(this, Corner.LOWER_RIGHT);
		this.flush();
	}

	flush() {
		this.points.forEach(point => {
			if(!this.nw.insert(point))
				if(!this.sw.insert(point))
					if(!this.ne.insert(point))
						this.se.insert(point);
		})
		this.points = [];		
	}

	queryTiles(query) {
		return null;
	}
}
