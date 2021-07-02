import Bbox from "./bbox.js";
import PointResponse from "./pointresponse.js";
import QuadTree from "./quadtree.js";
import QuadTreeConfig from "./quadtreeconfig.js";
import TileHashesQueryResponse from "./tilehashesqueryresponse.js";
import TileInfoResponse from "./tileinforesponse.js";

export default class QuadRoot {
	static pointsLength = 4;
	
	constructor(summaryFactory, depth = 20) {
		this.config = new QuadTreeConfig(summaryFactory, depth, QuadRoot.pointsLength);
		
		// Don't really need it but it doesn't hurt.
		this.boundary = Bbox.createOrigin();

		this.left  = QuadTree.createLeft(this.config);
		this.right = QuadTree.createRight(this.config);
	}	

	insert(p) {
		// Zero goes right
		if(p.getLongitude() < 0) {
			return this.left.insert(p);
		} else {
			return this.right.insert(p);
		}
	}

    queryTiles(query) {
		let response = new TileHashesQueryResponse(query);
		this.left.matchTiles(response);
		this.right.matchTiles(response);
		return response;
	}

	query(query) {
		let response = new PointResponse(query);
		this.left.decoratePoints(response);
		this.right.decoratePoints(response);
		return response;
	}
	
	tileInfo(query) {
		let response = new TileInfoResponse(query);
		this.left.decorateTileInfo(response);
		this.right.decorateTileInfo(response);
		return response;
	}

	querySummary(query) {
		return this.left.querySummary(query).concat(this.right.querySummary(query));
	}	
	
	getTreeDepth() {
		return this.config.maxDepth;
	}
}
