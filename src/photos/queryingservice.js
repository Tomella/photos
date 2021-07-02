
import BboxQuery from "../quadtree/bboxquery.js";
import GeoJsonFilter from "../quadtree/geojsonfilter.js";
import GeojsonPhotoPointRecordConverter from "../photos/geojsonphotopointrecordconverter.js";
import PhotoSummaryFactory from "../photos/photosummaryfactory.js";
import Point from "../quadtree/point.js";
import PointQuery from "../quadtree/pointquery.js";
import QuadRoot from "../quadtree/quadroot.js";
import ZoomDepthStrategy from "../quadtree/zoomdepthstrategy.js";

import fetch from "node-fetch";

export default class QueryingService {

    constructor(config) {
        this.config = config;
    }

    load(map) {
        
        let converter = new GeojsonPhotoPointRecordConverter();
        let factory = new PhotoSummaryFactory();
        
        let root = this.root = new QuadRoot(factory);
    
        let count = 0;
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
        return this.root;
    }

    async init() {
        let url = this.config.allPointsURL;
        // Check the files in the src/test/resouces to see how many we
        // should iterate over. Might throw a few of them out cause it's
        // about 200 Mb with all of the data.
        let response = await fetch(url);
        let map = await response.json();
    
        console.log(map);
        //console.log(JSON.stringify(map, null, 3));
        return this.load(map);
    }

    getAggregation(request) {
        if (request.getXmin() || request.getXmax()) { // Is it an extent request		
            let query = new BboxQuery(new Point(request.getYmin(), request.getXmin()), new Point(request.getYmax(), request.getXmax()));
            return this.root.query(query, query.getBbox().getCenter());
        } else { // or is it a point request
            let pointQuery = this.preparePointQuery(request);
            return this.root.query(pointQuery, request.getPoint());
        }
    }

    getFeatures(request) {
        let query = this.preparePointQuery(request);
        return this.runFeatures(query, request);
    }

    getFeatures(request) {
        let query = new BboxQuery(new Point(request.getYmin(), request.getXmin()), new Point(request.getYmax(), request.getXmax()));
        return this.runFeatures(query, request);
    }

    getFeatures(request) {
        let query = new TileHashesQuery(request.getTileHashes());
        let response = this.quadTreeService.getQuadTree().queryTiles(query);
        let converter = new PointResponseWfsJsonConverter(request);
        return converter.convert(response);
    }

    runFeatures(query, request) {
        query.addFilters(request.getFilters());
        let response = this.quadTreeService.getQuadTree().query(query);
        let converter = new PointResponseWfsJsonConverter(request);

        return converter.convert(response);
    }

    preparePointQuery(request) {
        let pointQuery = new PointQuery();
        pointQuery.setDepth(ZoomDepthStrategy.convert(request.getZoom()));
        pointQuery.setPoint(request.getPoint());
        pointQuery.addFilters(request.getFilters());
        return pointQuery;
    }

    async getSummary(request) {
        let query = new BboxQuery(new Point(request.getYmin(), request.getXmin()), new Point(request.getYmax(), request.getXmax()));
        query.addFilters(request.getFilters());

        // Trying an arbitrary depth to begin with
        query.setDepth(ZoomDepthStrategy.convert(request.getZoom()));

        let response = this.root.querySummary(query);
        return new GeoJsonFilter().filter(response);
    }
}

