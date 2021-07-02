import PhotoPointRecord from "../photos/photopointrecord.js";

export default class GeojsonPhotoPointRecordConverter {
	convert(item) {
		if(item != null) {
			let geom = item.geometry;
			let properties = item.properties;
			
			
			if(geom && properties) {
				let coords = geom.coordinates;
				
				if (coords && coords.length > 1) {
					let point = null;
					if(coords.length == 2) {
						point = new PhotoPointRecord(coords[1], coords[0]);
					} else {
						point = new PhotoPointRecord(coords[1], coords[0], coords[2]);
					}
					let id = item.properties && item.properties.id ? item.properties.id : null;
			
					if(id) {
						point.setId(id);
						Object.keys(properties).forEach(key => {
							point.put(key, properties[key]);
						});						
						return point;
					}
				}
			}
		}
		return null;
	}
}
