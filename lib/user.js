import Location from "./location.js";

// INSERT INTO `spatial_test`.`locations` (`id`, `coordinates`) VALUES (NULL, GeomFromText('POINT(40.782710 -73.965310)'));

class User {
    constructor(pool) {
        this.pool = pool;
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
    async findCreate(data) {
        let existing = await this.findById(data.id);
        if(existing) {
            return existing;
        }
        let fields = Object.assign({admin: "N"}, data);
        let [results] = await this.pool.query('INSERT INTO user SET ?', fields);
        return results.affectedRows == 1 ? fields : null;
    }

    async findById(id) {
        // Cull out the shonky ones
        let index = +id;
        if( Number.isNaN(index)) {
            return null;
        }

        let [results] = await this.pool.query('SELECT * FROM user where id = ?', +id);
        if(results && results.length)
            return results[0];
        else {
            return null;
        }
    }
}

export default User;
