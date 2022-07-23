
import Killer from "../lib/killer.js";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from "fs/promises";
import { spawn } from "child_process";

const upload = multer({ dest: 'uploads/' })

class PhotoRouter {
    constructor(config, photo, app, chain = []) {
        this.photo = photo;
        this.killer = new Killer(config);

        app.get('/delete/:id', ...chain, async (req, res) => {
            let id = +req.params.id;  // Cast it to a number so it is harmless.
            let next = +req.query.next;

            let record = await this.photo.findById(id);

            console.log(id, next, record)
            if (record) {
                try {
                    let response = await this.killer.remove(record.filename);
                    let del = await this.photo.delete(id);

                    if (next) {
                        res.redirect("/edit/" + next)
                    } else {
                        res.redirect("/");
                    }

                } catch (e) {
                    console.log(e);
                    res.redirect("/error");
                }
            } else {
                res.redirect("/error");
            }
        });

        app.post("/pupload", ...chain, async (req, res) => {
            console.log(req)
        });


        //   node lib/processupload.js --file=uploads/1b9a795b-fe12-4a99-9a70-54e938944f37.json
        app.post('/upload', ...chain, upload.array('file', 120), async (req, res, next) => {
            console.log(req.files);

            console.log(req.files);
            let latitude = req.query.latitude;
            let longitude = req.query.longitude;
            let jobId = uuidv4();

            // Do we overwrite or set lat/lng?
            if(typeof latitude != "undefined" && typeof longitude != "undefined") {
                req.files.forEach(element => {
                    element.latitude = latitude;
                    element.longitude = longitude;
                });
            }
            let handle = await fs.writeFile("uploads/" + jobId + ".json", JSON.stringify(req.files));

            console.log(req.query, typeof latitude, typeof longitude);

           //const subprocess = spawn("node", ['lib/processupload.js', '--file=uploads/' + jobId + '.json'], {
            //    detached: true,
            //    stdio: 'ignore'
            //});

            //subprocess.unref();
            res.send({ jobId });
            // req.files is array of `photos` files
            // req.body will contain the text fields, if there were any
        });

        //   node lib/processupload.js --file=uploads/1b9a795b-fe12-4a99-9a70-54e938944f37.json
        app.post('/uploadTest',  upload.array('file', 120), async (req, res, next) => {
            console.log(req.files);
            let latitude = req.query.latitude;
            let longitude = req.query.longitude;
            let jobId = uuidv4();

            console.log(req.query, typeof latitude, typeof longitude);

            let args = ['lib/processupload.js', '--file=uploads/' + jobId + '.json']

            if(typeof latitude != "undefined" && typeof longitude != "undefined") {
                args.push("--latitude=" + latitude);
                args.push("--longitude=" + longitude);
            }
            const subprocess = spawn("node", args, {
                detached: true,
                stdio: 'ignore'
            });

            subprocess.unref();
            console.log(args);

            res.send({ jobId });
            // req.files is array of `photos` files
            // req.body will contain the text fields, if there were any
        });

    }
}

export default PhotoRouter;
