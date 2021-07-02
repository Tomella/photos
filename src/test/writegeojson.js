import fetch from "node-fetch";

run().then(response => {
    console.log("Finit");
});

async function run() {
    let fileIndex = 10;

    let count = 0;
    let url = "http://localhost:3000/all";

    let response = await fetch(url);
    let json = await response.json();
    console.log(JSON.stringify(json, null, 3));
    //let featureCount = json.features.length;
}


class GeoJson {
    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }
    getFeatures() {
        return this.features;
    }

    setFeatures(features) {
        this.features = features;
    }

    getTotalFeatures() {
        return this.totalFeatures;
    }

    setTotalFeatures(totalFeatures) {
        this.totalFeatures = totalFeatures;
    }

    getCrs() {
        return this.crs;
    }

    setCrs(crs) {
        this.crs = crs;
    }
}
