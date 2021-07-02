import GeojsonPhotoPointRecordConverter from "../photos/geojsonphotopointrecordconverter.js";
import PhotoPointRecord from "../photos/photopointrecord.js";
import PhotoSummaryFactory from "../photos/photosummaryfactory.js";
import Point from "../quadtree/point.js";
import PointQuery from "../quadtree/pointquery.js";
import QuadRoot from "../quadtree/quadroot.js";

test();

function test() {
    let converter = new GeojsonPhotoPointRecordConverter();
    let factory = new PhotoSummaryFactory();
    let q = new QuadRoot(factory);

    // Lon/lat depth: 119.891647/-28.173606 464
    let record = new PhotoPointRecord(-28.173606, 119.891647, 464);
    q.insert(record);

    q.right.conditionalFlush();
    q.left.conditionalFlush();
    let query = new PointQuery();
    query.setDepth(10);
    query.setPoint(new Point(-28.173606, 119.891647));

    let r = q.query(query);
    console.log(r);
}
