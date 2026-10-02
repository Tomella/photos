import express from 'express';
import Photo from "../lib/photo.js";
import Keyword from "../lib/keyword.js";

class AlbumRouter {
    constructor(pool) {
        this.service = new Photo(pool);
        this.keywordService = new Keyword(pool);
        let router = this.router  = express.Router();

        // define the home page route
        router.get('/keyword', async (req, res) => {
            let matches = await this.service.findByKeyword(req.query.keyword);
            res.send(matches);
        });
        
        router.get('/photosKeywords', async (req, res) => {
            let keywords = await this.keywordService.forPhoto(+req.query.id);
            res.send(keywords);
        });
    }
}

export default AlbumRouter;
