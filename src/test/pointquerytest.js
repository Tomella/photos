import PointRequest from "../quadtree/pointrequest.js";

hashToQueryTest();

function hashToQueryTest() {
    for (let i = 0; i < 100; i++) sample();
}

function sample() {
    let z = Math.floor(Math.random() * 18);

    let tilesY = 1 << z;
    let tilesX = tilesY * 2;

    let width = 180 / (1 << z);
    let halfWidth = width / 2;

    let x = Math.floor(Math.random() * tilesX);
    let y = Math.floor(Math.random() * tilesY);

    let request = PointRequest.hashToQuery("" + x, "" + y, "" + z);


    let point = request.getPoint();

    let expected = point.getLatitude() - halfWidth - (y * width);

    // Assert.assertEquals(-90d, expected, 0.0000001);

    console.log("For a zoom of " + z + " there are x tiles " + tilesX + ", y tiles " + tilesY + 
        " and a width, halfwidth of " +
        width + ", " + halfWidth + "\n" +
        z + "/" + x + "/" + y + "\n" + JSON.stringify(request));
}
