/**
 * Look here for inspiration as needed...
 * http://www.movable-type.co.uk/scripts/latlong.html
 *
 * and here
 * http://paulbourke.net/
 *
 * Between those descriptions we should be able to build most things.
 *
 */

// At the equator
export let RADIANS_TO_METERS = 6371000;
export let METERS_TO_RADIANS = 1 / RADIANS_TO_METERS;

// OK
export function convertDegreesToRadians(num) {
   return num * Math.PI / 180;
};

// OK
export function convertRadiansToDegree(num) {
   return num * 180 / Math.PI;
};

export function normalizeRadians(angle) {
    let newAngle = angle;
    while (newAngle <= -Math.PI) newAngle += 2 * Math.PI;
    while (newAngle > Math.PI) newAngle -= 2 * Math.PI;
    return newAngle;
}

// OK
export function expandBbox(bbox, rawPoint) {
   bbox[0] = Math.min(bbox[0], rawPoint[0]);
   bbox[1] = Math.min(bbox[1], rawPoint[1]);
   bbox[2] = Math.max(bbox[2], rawPoint[0]);
   bbox[3] = Math.max(bbox[3], rawPoint[1]);
}

// Not OK
export function culledBbox(container, subset) {
   // We try to pull them into line
   let left = subset[0] < container[0] ? container[0] : subset[0];
   let right = subset[2] > container[2] ? container[2] : subset[2];
   let bottom = subset[1] < container[1] ? container[1] : subset[1];
   let top = subset[3] > container[3] ? container[3] : subset[3];

   // Now make sure that they are still within.
   if (left > subset[2]       // To far right
      || right < subset[0]    // To far left
      || top < subset[1]      // To low
      || bottom > subset[3]   // To high
      || left >= right        // To narrow
      || top <= bottom) {     // Too thin
         return null;
   }
   return [left, bottom, right, top];
}

/**
 * Given an array of points, create a bounding box that encompasses them all.
 * Optionally buffer the box by a proportion amount eg 0.05 represents a 5% further south, west east and north.
 * Keep in mind with this example that is 21% more area because it grows 5% in 4 directions.
 */
export function createBboxFromPoints(coords, buffer = 0) {
   let bbox = [Infinity, Infinity, -Infinity, -Infinity];
   coords.forEach(point => {
      expandBbox(bbox, point);
   });
   if (buffer) {
      return createBufferedBbox(bbox, buffer);
   }
   return bbox;
}

/**
 * Buffer the box by a proportion amount eg 0.05 represents a 5% further south, west east and north.
 * Keep in mind with this example that is 21% more area because it grows 5% in 4 directions.
 * That is it is 10% wider and 10% higher.
 *
 */
export function createBufferedBbox(bbox, buffer) {
   let deltaX = (bbox[2] - bbox[0]) * buffer;
   let deltaY = (bbox[3] - bbox[1]) * buffer;
   return [
      bbox[0] - deltaX,
      bbox[1] - deltaY,
      bbox[2] + deltaX,
      bbox[3] + deltaY
   ];
}

/**
 * Test that a position is within the bounding box.
 */
export function positionWithinBbox(bbox, position) {
   return bbox[0] <= position[0]
      && bbox[1] <= position[1]
      && bbox[2] >= position[0]
      && bbox[3] >= position[1];
}

/**
 * Taken a few points make the line have more points, with each point along the line.
 */
export function densify(line, count) {
   let segmentDetails = calculateSegmentDetails(line);
   let wayPointLength = calculateLineLength(line) / (count - 1);
   let segmentIndex = 0;
   let buffer = [line[0]];
   for (let i = 1; i < count - 1; i++) {
      let distanceAlong = wayPointLength * i;

      while (distanceAlong > segmentDetails[segmentIndex].startOrigin + segmentDetails[segmentIndex].length) {
         segmentIndex++;
      }
      let segment = segmentDetails[segmentIndex];

      let point = calculatePosition(segment.start, segment.bearing, distanceAlong - segment.startOrigin);

      buffer.push(point);
   }
   buffer.push(line[line.length - 1]);
   return buffer;
}

export function calculatePosition(pt, bearing, distance) {
   let dist = distance / 6371000;  // convert dist to angular distance in radians
   let brng = convertDegreesToRadians(bearing);

   let lon1 = convertDegreesToRadians(pt[0]);
   let lat1 = convertDegreesToRadians(pt[1]);


   let lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
      Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

   let lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));

   lon2 = normalizeRadians(lon2);  // normalise -180 to +180

   return [convertRadiansToDegree(lon2), convertRadiansToDegree(lat2)];
}

export function calculateSegmentDetails(line) {
   if (line.length < 2) {
      return [0];
   }

   let lengths = [];
   let accumulateLength = 0;
   for (let i = 1; i < line.length; i++) {
      let length = calculateDistance(line[i - 1], line[i]);
      let endLength = accumulateLength + length;
      lengths.push({
         start: line[i - 1],
         end: line[i],
         bearing: calculateBearing(line[i - 1], line[i]),
         length: length,
         startOrigin: accumulateLength
      });
      accumulateLength = endLength;
   }
   return lengths;
}

/**
 * Tested and working OK.
 */
export function calculateLineLength(points) {
   let accumulator = 0;
   if (points.length > 1) {
      for (let i = 1; i < points.length; i++) {
         accumulator += calculateDistance(points[i - 1], points[i]);
      }
   }
   return accumulator;
}

// from http://www.movable-type.co.uk/scripts/latlong.html
export function calculateDistance(pt1, pt2) {
   let lon1 = pt1[0],
      lat1 = pt1[1],
      lon2 = pt2[0],
      lat2 = pt2[1],
      dLat = convertDegreesToRadians(lat2 - lat1),
      dLon = convertDegreesToRadians(lon2 - lon1),
      a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(convertDegreesToRadians(lat1))
         * Math.cos(convertDegreesToRadians(lat2)) * Math.pow(Math.sin(dLon / 2), 2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return c * RADIANS_TO_METERS; // returns meters
}

function calculatePositionAlong(coords, distance) {
   if (!coords) {
      return null;
   }
   if (coords.length < 2) {
      return coords[0];
   }

   let fromStart = 0;

   for (let i = 0; i < coords.length; i++) {
      let segmentStart = coords[i];
      let segmentEnd = coords[i + 1];

      let segmentLength = calculateDistance(segmentStart, segmentEnd);
      if (fromStart + segmentLength < distance) {
         fromStart += segmentLength;
         continue;
      }

      let brng = calculateBearing(segmentStart, segmentEnd);
      return destination(segmentStart, distance - fromStart, brng);
   }
}


/**
 * Give a start point, a bearing give me the point that distance meters along the path
 */
export function destination(from, distance, bearing) {
   let longitude1 = convertDegreesToRadians(from[0]);
   let latitude1 = convertDegreesToRadians(from[1]);
   let bearing_rad = convertDegreesToRadians(bearing);

   let radians = distance * METERS_TO_RADIANS;

   let latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) +
      Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearing_rad));
   let longitude2 = longitude1 + Math.atan2(Math.sin(bearing_rad) *
      Math.sin(radians) * Math.cos(latitude1),
      Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));

   return [convertRadiansToDegree(longitude2), convertRadiansToDegree(latitude2)];
};

/**
 * Given two positions return the bearing from one to the other (source -> destination)
 */
export function calculateBearing(source, destination) {
   let lon1 = convertDegreesToRadians(source[0]);
   let lat1 = convertDegreesToRadians(source[1]);
   let lon2 = convertDegreesToRadians(destination[0]);
   let lat2 = convertDegreesToRadians(destination[1]);

   let a = Math.sin(lon2 - lon1) * Math.cos(lat2);
   let b = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

   return convertRadiansToDegree(Math.atan2(a, b));
}
