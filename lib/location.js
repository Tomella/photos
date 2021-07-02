
class Location {
    constructor(lat, long) {
       this.lat = lat;
       this.long = long;
    }
    toSqlString() {
       return 'POINT(' + [this.long, this.lat].join(', ') + ')';
    }
 }

 export default Location
