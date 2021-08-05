import express from 'express';
import Killer from "../lib/killer.js";

// photosDirectory: "./photos/photos/",
// thumbsDirectory: "./photos/photos/thumbs/"
class DeleteRouter {
    constructor(config, photo) {
        this.photo = photo;
        this.router  = express.Router();
        this.killer = new Killer(config);
    }

    addRoutes() {
        this.router.get('/:id',  async (req, res) => {
            let id = +req.params.id;  // Cast it to a number so it is harmless.
            let next = +req.query.next;

            let record = await this.photo.findById(id);

            console.log(id, next, record)
            if(record) {
                try {
                    let response = await this.killer.remove(record.filename);
                    let del = await this.photo.delete(id);
                    if(next) {
                        res.redirect("/edit/" + next)
                    } else {
                        res.redirect("/");
                    }

                } catch(e) {
                    console.log(e);
                    res.redirect("/error");
                }
            } else {
                res.redirect("/error");
            }
        });
        
    }
}

export default DeleteRouter;
