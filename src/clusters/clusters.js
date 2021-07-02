import PhotoPointRecordConverter from "../photos/photopointrecordconverter.js";
import PhotoSummaryFactory from "../photos/photosummaryfactory.js";
import QuadRoot from "../quadtree/quadroot.js";

export default class Clusters {
    constructor(data) {
        this.root = root;
    }
}

/*

*/
function prepareRoot(features) {
    let converter = new PhotoPointRecordConverter();
    let factory = new PhotoSummaryFactory();
    let root = new QuadRoot(factory);
    let count = 0;
    //console.log(JSON.stringify(map, null, 3));

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

    return root;
}
