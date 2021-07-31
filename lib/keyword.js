class Keyword {
    constructor(pool) {
        this.pool = pool;
    }

    async add(name) {
        const details = {
            name: name
        };

        let [results] = await this.pool.query('INSERT IGNORE INTO keyword SET ?', details);
        return results;
    }

    async all() {
        let query = 'SELECT * FROM keyword';
        let [results] = await this.pool.query(query);
        return results;
    }

    async forPhoto(id) {
        let query = 'SELECT k.name FROM photo_keyword p INNER JOIN keyword k ON p.keyword = k.name where p.photo = ?';
        let [results] = await this.pool.query(query, [id]);
        return results;
    }
}

export default Keyword;
