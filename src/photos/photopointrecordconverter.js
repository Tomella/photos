import PhotoPointRecord from "../photos/photopointrecord.js";
/*
{
    "id": 2865,
    "filename": "IMG_20200701_131925805.jpg",
    "description": "motorola moto g(7) power",
    "latitude": -34.076773,
    "longitude": 137.607585,
    "elevation": 37.438,
    "time_point": "2020-07-01T13:19:26.000Z",
    "location": {
      "x": 137.607585,
      "y": -34.076773
    }
*/
export default class PhotoPointRecordConverter {
    convert(item) {
        let point = new PhotoPointRecord(item.latitude, item.longitude, item.elevation);
        point.setId(item.id);
        Object.keys(item).filter(key => key != "location").forEach(key => {
            point.put(key, item[key]);
        });
        return point;
    }
}
