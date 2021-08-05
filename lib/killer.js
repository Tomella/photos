import { promises as fs } from "fs";

class Killer {
    constructor(config) {
        this.config = config;
    }

    async remove(filename) {
        let photoResult = await fs.rm(this.config.photosDirectory + filename);
        let thumbResult = await fs.rm(this.config.thumbsDirectory + filename);
        // The results are undefined on success so there is no point looking. It will reject (throw) on error.  
    }

}

export default Killer;
