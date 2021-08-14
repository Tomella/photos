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
            
            console.log(id)
            res.send(response);
            //res.send(response.map(item => item.name));
        })
        
        // define the about route
        router.post('/add', async (req, res) => {
            let response = await this.service.add(req.query.name);
            res.send(response);
        })
        
        // define the about route
        router.all('/save/:id', async (req, res) => {
            //We have two different scenarios. 
            // 1. We are assigning an existing keyword to a photo
            // 2. We are creating a new keyword and adding it to the photo
            let id = +req.params.id;
            let keyword = await this.service.findOrCreateByName(req.query.name);
            console.log("Response: ", keyword)
            await this.service.assignPhoto(keyword.id, id);
            let keywords = await this.service.forPhoto(id);
            res.send(keywords);
        })
        
        // define the about route
        router.all('/unlink/:id', async (req, res) => {
            let id = +req.params.id;
            let name = req.query.name;

            let [keyword] = await this.service.findByName(name);

            if(keyword && keyword.id) {
                await this.service.unlinkPhoto(keyword.id, id);
            }
            let keywords = await this.service.forPhoto(id);
            res.send(keywords);
        })
    }
}

export default KeywordsRouter;
