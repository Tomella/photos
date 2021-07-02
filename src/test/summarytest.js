import ExtentRequest from "../quadtree/extentrequest.js";
import QueryingService from "../photos/queryingservice.js";
import config from "./config.js";

test().then(result => {
    console.log("finit");
}).catch(e => {
    console.log(e);
})


async function test() {

    let queryingService = new QueryingService(config);

    await queryingService.init();

    let request = new ExtentRequest(-179, 179, -89, 89, 1);

    let response = await queryingService.getSummary(request);
    //console.log(JSON.stringify(response, null, 2))

    let total = response.features.reduce((acc, feature) => 
        acc + feature.properties.count , 
    0);

    console.log(total);
    //System.out.println(om.writerWithDefaultPrettyPrinter().writeValueAsString(response));
}

