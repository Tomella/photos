// Just an abreviated version of all points.
export default function pointsToJson(photos, name = "photos") {
   return {
      type: "FeatureCollection",
      name,
      features: photos.map(photo => ({
         type: "Feature",
         properties: {
            name: photo.filename,
            description: photo.description,
            annotation: photo.annotation,
            id: photo.id,
            time_point: photo.time_point,
            elevation: photo.elevation
         },
         geometry: {
            type: "Point",
            coordinates: [
               photo.longitude,
               photo.latitude
            ]
         }
      }))
   };
}
