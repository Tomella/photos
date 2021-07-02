export default class ZoomDepthStrategy {
	static maxDepth = 20;	
	
	static mapping = [
			20, //  0 - 2 tiles, 180
			19, //  1 - 8 tiles, 90
			18, //  2 - 32 tiles, 45
			17, //  3 - 128 tiles, 22.5
			16, //  4 - 512 tiles, 11.25
			15, //  5 - 2K tiles, 5.625
			14, //  6 - 8K tiles, 2.8125
			13, //  7 - 32k tiles, 1.40625
			12, //  8 - 128k tiles, 0.703125
			11, //  9 - 512k tiles, 0.351625
			10, // 10 - 2m tiles, 0.175781235
			9,  // 11 - 8m tiles, 0.08789 - ~8km
			8,  // 12 - 32m tiles, 0.0439 - ~4km
			7,  // 13 - 128m tiles, 0.02197 - ~ 2km
			6,  // 14 - 512m tiles, 0.010986328125 - ~1km
			5,  // 15 - 2G tiles, 0.0054931640625 - ~500m
			4,  // 16 - 8G tiles, 0.00274658203125 - 250m
			3,  // 17 - 32G tiles, 0.001373291015625 - ~125m
			2,  // 18 - 128G tiles, 0.0006866455078125 - ~60m
			1   // 19 - 512G tiles, 0.00034332275390625 - ~30m
    ];
	
	static setMaxDepth(depth) {
		ZoomDepthStrategy.maxDepth = depth;
		ZoomDepthStrategy.mapping = depth + 1;
		for(let i = 0; i < depth + 1; i++) {
			ZoomDepthStrategy.mapping[i] = depth - i;
		}		
	}
	
	static getMaxDepth() {
		return ZoomDepthStrategy.maxDepth;
	}
	
	static convert(zoom) {
		if(zoom >= ZoomDepthStrategy.mapping.length) {
			return ZoomDepthStrategy.mapping[ZoomDepthStrategy.mapping.length - 1];
		}
		if(zoom < 0) {
			return ZoomDepthStrategy.mapping[0];
		}
		return ZoomDepthStrategy.mapping[zoom];
	}
}
