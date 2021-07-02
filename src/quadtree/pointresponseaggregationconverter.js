let defaultProperties = 

export default class PointResponseAggregationConverter {

	constructor(point) {
		this.point = point;
	}
	
	convert(item) {
		let points = item.getPoints();        
		let properties = {};

		let response = {
            type: "Feature",
            geometry: this.point.getGeometry(),
			properties
		};

		for (RockPropertyEnum rpe : RockPropertyEnum.values()) {
			properties.put(rpe.getName(), new HashMap<String, Integer>());
		}
		if(points != null) {
			for(Point point : points) {
				Map<String, Object> featureProperties = point.getProperties();
				for (RockPropertyEnum rpe : RockPropertyEnum.values()) {
					// Typically this will be a string or null.
					Object featureKey = featureProperties.get(rpe.toString());

					if (featureKey != null) {
						Map<String, Integer> property = properties.get(rpe.getName());
						if (property.containsKey(featureKey)) {
							property.put(featureKey.toString(), 1 + property.get(featureKey.toString()));
						} else {
							property.put(featureKey.toString(), 1);
						}
					}
				}				
			}			
		}		
		
		return response;
	}
}
