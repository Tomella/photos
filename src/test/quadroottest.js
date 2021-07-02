import fs from "fs";

import BboxQuery from "../quadtree/bboxquery.js";
import GeoJsonFilter from "../quadtree/geojsonfilter.js";
import GeojsonPhotoPointRecordConverter from "../photos/geojsonphotopointrecordconverter.js";
import PhotoSummaryFactory from "../photos/photosummaryfactory.js";
import Point from "../quadtree/point.js";
import QuadRoot from "../quadtree/quadroot.js";

let root;
console.log("TestSummary\n========");
//testSummary();
console.log("TestTileInfoPoint\n==============");
testTileInfoPoint();

function prepareRoot() {
    let converter = new GeojsonPhotoPointRecordConverter();

    if (root == null) {
        let factory = new PhotoSummaryFactory();
        root = new QuadRoot(factory);

        let count = 0;
        // Check the files in the src/test/resouces to see how many we
        // should iterate over. Might throw a few of them out cause it's
        // about 200 Mb with all of the data.
        let f = fs.readFileSync("../../data/testpoints.json");
        let map = JSON.parse(f);

        console.log(map);
        //console.log(JSON.stringify(map, null, 3));

        let features = map.features;
        features.forEach((obj, i) => {
            //console.log("Starting loading " + i + "...");
            let record = converter.convert(obj);
            if (record != null) {
                count++;
                root.insert(converter.convert(obj));
            } else {
                // Not fatal but it seems strange to me that there are records missing data.
                console.log("Something is missing:\n" + JSON.stringify(obj, null, 3));
            }
        });
        console.log("End load " + features.length + "...");
    }
}

function testSummary() {
    prepareRoot();

    let query = new BboxQuery(new Point(-45.6883, 145.913), new Point(-39.482, 149.649));
    // Zoom = 9 on rock-properties.html		
    query.setDepth(11);
    let start = Date.now();

    let response = root.querySummary(query);
    let end = Date.now();

    console.log("Query took " + (end - start) + "ms");

    let geoJsonFilter = new GeoJsonFilter();
    let geoJson = geoJsonFilter.filter(response);
    let filter = Date.now();
    console.log("Filter took " + (filter - end) + "ms");

    let stringify = Date.now();
    console.log("Stringify took " + (stringify - filter) + "ms");

    console.log(JSON.stringify( response, null, 3));
}

function testTileInfoPoint() {
    prepareRoot();

    let query = new BboxQuery(new Point(-45.6883, 145.913), new Point(-39.482, 149.649));
    query.setDepth(7);

    let response = root.tileInfo(query);
    console.info(JSON.stringify(response, null, 2));
}
