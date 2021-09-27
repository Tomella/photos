import express from 'express';
import Photo from "../lib/photo.js";

class AlbumRouter {
    constructor(pool) {
        this.service = new Photo(pool);
        let router = this.router  = express.Router();

        // define the home page route
        router.get('/keyword', async (req, res) => {
            let matches = await this.service.findByKeyword(req.query.keyword);
            res.send(matches);
        })
        
    }
}

export default AlbumRouter;
