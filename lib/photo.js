import Keyword from "./keyword.js";
import Location from "./location.js";

// INSERT INTO `spatial_test`.`locations` (`id`, `coordinates`) VALUES (NULL, GeomFromText('POINT(40.782710 -73.965310)'));

class Photo {
    constructor(pool) {
        this.pool = pool;
        this.keyword = new Keyword(pool);
    }

    /*
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `filename` varchar(250) NOT NULL DEFAULT '0',
        `description` varchar(2500),
        `latitude` double NOT NULL DEFAULT '0',
        `longitude` double NOT NULL DEFAULT '0',
        `elevation` double NOT NULL DEFAULT '0',
        `time_point` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `location` point NOT NULL,
    */
    async write(data) {
        const details = {
            filename: data.filename,
            description: data.description,
            latitude: +data.latitude,
            longitude: +data.longitude,
            elevation: +data.elevation,
            time_point: new Date(data. time_point),
            location: new Location(+data.latitude, +data.longitude)
        };

        let [results] = await this.pool.query('INSERT IGNORE INTO photo SET ?', details);
        return results;
    }

    async delete(id) {
        console.log(" Delete id = " + id);
        let results = await this.pool.query('delete from photo where id = ?', id);
        return results;
    }

    async update(data) {
        const details = {
            filename: data.filename,
            description: data.description,
            annotation: data.annotation,
            latitude: +data.latitude,
            longitude: +data.longitude,
            elevation: +data.elevation,
            time_point: new Date(data.time_point),
            location: new Location(+data.latitude, +data.longitude)
        };
        let [results] = await this.pool.query('UPDATE photo SET ? WHERE id = ' + (+data.id), details);
        console.log(results);
        return details;
    }

    async findByKeyword(keyword) { 
        if(!keyword) {
            return [];
        }       
        let [results] = await this.pool.query(`
            SELECT * FROM photo WHERE photo.id IN 
                (SELECT photo FROM photo_keyword WHERE keyword in (SELECT id FROM keyword WHERE NAME = ?))
        `, keyword);
        return results;
    }

    async findById(id) {
        return !id ? null : this.findByIdQuery('SELECT * FROM photo where id = ?', id);
    }

    async findNext(id) {
        return this.findByIdQuery('SELECT * FROM photo WHERE id > ? order by id asc LIMIT 1', id);
    }

    async findPrevious(id) {
        return this.findByIdQuery('SELECT * FROM photo WHERE id < ? order by id desc LIMIT 1', id);
    }

    async findByIdWithAdjacent(id) {
        let result = await this.findById(id);
        if(result) {
            result.keywords = await this.keyword.forPhoto(id);
            result.next = await this.findNext(id);
            result.previous = await this.findPrevious(id);
        }
        return result;
    }

    async findByIdQuery(query, id) {
        // Cull out the shonky ones
        let index = +id;
        if( Number.isNaN(index)) {
            return null;
        }

        let [results] = await this.pool.query(query, index);
        if(results && results.length)
            return results[0];
        else {
            return null;
        }
    }

    async all(startDate, endDate) {
        let query = 'SELECT * FROM photo';
        let parameters = [];
        if(startDate || endDate) {
            query = query + " WHERE ";
        }

        if(startDate) {
            query = query + "time_point >= ?";
            parameters.push(new Date(startDate));
        }
        if(startDate && endDate) {
            query = query + " AND ";
        }

        if(endDate) {
            query = query + "time_point <= ?";
            parameters.push(new Date(endDate));
        }
        console.log(query, parameters.join(" "));
        let [results] = await this.pool.query(query, parameters);
        return results;
    }
}

export default Photo;
