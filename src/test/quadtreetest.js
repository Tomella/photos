import fs from "fs";

import BboxQuery from "../quadtree/bboxquery.js";
import GeoJsonFilter from "../quadtree/geojsonfilter.js";
import GeojsonPhotoPointRecordConverter from "../photos/geojsonphotopointrecordconverter.js";
import PhotoSummaryFactory from "../photos/photosummaryfactory.js";
import Point from "../quadtree/point.js";
import PointQuery from "../quadtree/pointquery.js";
import PointRequest from "../quadtree/pointrequest.js";
import QuadRoot from "../quadtree/quadroot.js";

let root;
try {
    testSummaryWithFilter();
} catch(e) {
    console.log("Fail!", e);
}

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

//@Test
function testBoxQuery() {
    prepareRoot();

    let ll = new Point(-46.6, 138.5);
    let ur = new Point(-42.5, 147.6);

    let query = new BboxQuery(ll, ur);
    query.setDepth(9); // [[zoom, depth], ...] = [

    let response = root.query(query);
    let responseStr = JSON.stringify(response, null, 2);

    console.log("We have " + response.getPoints().length + " points, " + "response length = " + responseStr);
}


//@Test
function testQuery() {
    prepareRoot();

    let query = new PointQuery();
    query.setDepth(7); // [[zoom, depth], ...] = [

    query.setPoint(new Point(-43.270028, 147.348296));
    let response = root.query(query);

    console.log("We have " + response.getPoints().length + " points, " + "response = " + JSON.stringify(response, null, 2));
}



function testQueryMatch() {
    prepareRoot();

    let query = new PointQuery();
    query.setDepth(7); // [[zoom, depth], ...] = [

    query.setPoint(new Point(-43.270028, 147.348296));
    let response = root.query(query);

    console.log("testQueryMatch: We have " + response.getPoints().length + " points\n" + JSON.stringify(query));
}


function testQueryHash() {
    // -41.440813,147.1273109
    let r = PointRequest.hashToQuery(228, 37, 7);
    let query = new PointQuery();
    query.setDepth(7); // [[zoom, depth], ...] = [

    query.setPoint(r.getPoint());
    
    prepareRoot();
    let response = root.query(query);

    console.log("testQueryHash: We have " + response.getPoints().length + " points\n" + JSON.stringify(query));
}

//@Test
function testQueryWithFilter() {
    prepareRoot();

    let query = new PointQuery();
    query.setDepth(17); // [[zoom, depth], ...] = [

    query.setPoint(new Point(-41.4406686, 147.1303473));
    query.addFilter("description", "motorola moto g(7) power");

    let response = root.query(query);

    console.log("We have " + response.getPoints().length + " points\n" + JSON.stringify(query));
}

// @Test
function testSummary() {
    console.log("TestSummary");

    prepareRoot();

    let query = new BboxQuery(new Point(-45.6883, 145.913), new Point(-43.482, 149.649));
    // Zoom = 9 on rock-properties.html
    query.setDepth(10);
    let start = Date.now();

    let response = root.querySummary(query);
    let end = Date.now();

    console.log("Query took " + (end - start) + "ms");

    let geoJsonFilter = new GeoJsonFilter();

    let geoJson = geoJsonFilter.filter(response);

    let filter = Date.now();
    console.log("Filter took " + (filter - end) / 1000 + "us");

    let stringify = Date.now();
    console.log("Stringify took " + (stringify - filter) + "ms");

    console.log(JSON.stringify(response, null, 2));
}

// @Test
function testSummaryWithFilter() {
    console.log("TestSummaryWithFilter");
    prepareRoot();

    let query = new BboxQuery(new Point(-35.6883, 145.913), new Point(-33.482, 149.649));
    // Zoom = 9 on rock-properties.html
    query.setDepth(1);

    query.addFilter("name", "IMG_20191120_152624798.jpg");
    let start = Date.now();

    let response = root.querySummary(query);
    let end = Date.now();

    console.log("Query took " + (end - start) + "ms");

    let geoJsonFilter = new GeoJsonFilter();

    let geoJson = geoJsonFilter.filter(response);

    let filter = Date.now();
    console.log("Filter took " + (filter - end) + "ms");

    let responseStr = JSON.stringify(geoJson, null, 2);
    let stringify = Date.now();
    console.log("Stringify took " + (stringify - filter) + "ms");

    console.log(responseStr);
}
