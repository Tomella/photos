import express from 'express';
import Keyword from "../lib/keyword.js";

class KeywordsRouter {
    constructor(pool) {
        this.service = new Keyword(pool);
        let router = this.router  = express.Router();

        // define the home page route
        router.get('/all', async (req, res) => {
            let all = await this.service.all();
            res.send(all);
        })
        
        // define the about route
        router.get('/for/:id', async (req, res) => {
            let id = +req.params.id;  // Cast it to a number so it is harmless.
            let response = await this.service.forPhoto(id);
            res.send(response.map(item => item.name));
        })
        
        // define the about route
        router.post('/add', async (req, res) => {
            let response = await this.service.add(req.query.name);
            res.send(response);
        })
    }
}

export default KeywordsRouter;
