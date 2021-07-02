export default class QuadTreeConfig {
	constructor(summaryFactory, maxDepth, pointsLength) {
		this.summaryFactory = summaryFactory;
		this.maxDepth = maxDepth;
		this.pointsLength = pointsLength;
	}	
}
