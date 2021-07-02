import HalfTileInfo from "../quadtree/halftileinfo.js";
import TileHash from "../quadtree/tilehash.js";
import TileInfo from "../quadtree/tileinfo.js";
import assert from "assert";

let z = 5;
let x = 58;
let y = 11;

testSameness();
testHalfNorthEast();
testHalfNorth();
testHalfEast();

function testSameness() {
    let hash = new TileHash(z, x, y);

    let hti = new HalfTileInfo(z, x, y);


    let ti = new TileInfo(hash);

    assert.equal(ti.id, hti.id);

    // Even though they are different objects in Java to the client tier they should look the same when x and y are int (or int equivalent floats)
    for (let i = 0; i < 4; i++) {
        assert.equal(hti.getBbox()[i], ti.getBbox()[i]);
    }

    console.log(JSON.stringify(hti, null, 3) + "\n\n" +
        JSON.stringify(ti, null, 3));
}

function testHalfNorthEast() {
    let hash = new TileHash(z, x, y);
    let ti = new TileInfo(hash);

    let hti = new HalfTileInfo("" + z, "" + (x + 0.5), "" + (y - 0.5));


    let width = 360.0 / (1.0 * (2 << z));

    assert.equal(width, (hti.getBbox()[2] - hti.getBbox()[0]), 0.000001);
    assert.equal((ti.getBbox()[0] + width / 2.0), hti.getBbox()[0], 0.000001);
    console.log(JSON.stringify(hti, null, 3));
}

function testHalfNorth() {
    let hash = new TileHash(z, x, y);
    let ti = new TileInfo(hash);

    let hti = new HalfTileInfo("" + z, "" + x, "" + (y + 0.5));

    let width = 360.0 / (1.0 * (2 << z));

    assert.equal(width, (hti.getBbox()[2] - hti.getBbox()[0]), 0.000001);

    assert.equal((ti.getBbox()[1] + width / 2.0), hti.getBbox()[1], 0.000001);

    console.log(JSON.stringify(hti, null, 3));
}

function testHalfEast() {
    let hash = new TileHash(z, x, y);
    let ti = new TileInfo(hash);

    let hti = new HalfTileInfo("" + z, "" + (x + 0.5), "" + (y));

    let width = 360.0 / (1.0 * (2 << z));

    assert.equal(width, hti.getBbox()[2] - hti.getBbox()[0]);
    assert.equal(ti.getBbox()[0] + width / 2.0, hti.getBbox()[0]);

    console.log(JSON.stringify(hti), null, 3);
}
