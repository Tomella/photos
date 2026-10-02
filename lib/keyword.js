class Keyword {
    constructor(pool) {
        this.pool = pool;
    }

    async add(name) {
        let [results] = await this.pool.query('INSERT IGNORE INTO keyword SET ?', {name});
        return {
            name,
            id: results.insertId
        };
    }

    async findByName(name) {
        if(!name) {
            return null;
        }
        let [results] = await this.pool.query('SELECT * FROM keyword where name = ?', [name]);
        return results;
    }

    async findOrCreateByName(name) {
        let [results] = await this.findByName(name);
        if(results) {
            return results;
        }

        return this.add(name);
    }

    async all() {
        let query = `
        SELECT 
            p.*,
            COUNT(c.keyword) AS count
        FROM 
            keyword p
        LEFT JOIN 
            photo_keyword c ON p.id = c.keyword
        GROUP BY 
            p.name
        ORDER BY name; 
        `;
        let [results] = await this.pool.query(query);
        return results;
    }

    async forPhoto(id) {
        let query = 'SELECT k.* FROM keyword k WHERE k.id IN (SELECT p.keyword FROM photo_keyword p WHERE p.photo = ?)';
        let [results] = await this.pool.query(query, [id]);
        return results;
    }

    async assignPhoto(keyword, photo) {
        let rowData = {
            keyword,
            photo
        }
        console.log("Rowdata: ", rowData);
        let query = 'insert ignore into photo_keyword set ?';
        let [results] = await this.pool.query(query, rowData);
        return results;
    }
    
    async unlinkPhoto(keywordId, photoId) {
        let [results] = await this.pool.query('DELETE FROM photo_keyword WHERE keyword = ? AND photo = ?', [keywordId, photoId]);
        return results;
    }
}

export default Keyword;
