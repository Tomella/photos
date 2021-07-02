import GeoJsonPoint from "./geojsonpoint.js";

export default class GeoJsonFilter {

	filter(data) {
        let features = [];
		let response = {
            type: "FeatureCollection",
            features
        };

		if(data) {
            data.forEach(datum => {
                features.push(this.createFeature(datum));
            });
		}		
		return response;
	}

	createFeature(summaryResponse) {
		let tilehash = summaryResponse.getTilehash();
		return {
            type: "Feature",
            properties: summaryResponse.getResponse(),
            id: tilehash.getZ() + "/" + tilehash.getX() + "/" + tilehash.getY(),
            geometry: new GeoJsonPoint(summaryResponse.getPoint())
        };
	}
}
