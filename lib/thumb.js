import Jimp from 'jimp';

const DEFAULTS = {
    width: 256,
    height: Jimp.AUTO,
    quality: 60,
    photosDirectory: "./",
    thumbsDirectory: "./"
};

class Thumb {
    constructor(options = {}) {
        this.options = Object.assign({}, DEFAULTS, options);
    }

    async process(filename) {
        try {
            let file = await Jimp.read(this.options.photosDirectory + filename);

            return file
                .resize(this.options.width, this.options.height) // resize
                .quality(this.options.quality) // set JPEG quality
                .write(this.options.thumbsDirectory + filename); // save
        } catch(e) {
            console.log("That doesn't become a thumbnail: " + filename, e);
            return {
                error: e,
                _exif:{tags:{}}
            };
        }
    }

    async rotateThumb(filename, direction) {
        try {        
            let degrees = +direction === 180 ? 180 : {left: 90, right: 270, original: 0}[direction];
            if(!degrees && degrees !== 0 ) {
                throw new Error("Direction must be one of original, left, right or 180");
            };

            let file = await Jimp.read(this.options.photosDirectory + filename);

            return file
                .rotate(degrees) // rotate
                .resize(this.options.width, this.options.height) // resize
                .quality(this.options.quality) // set JPEG quality
                .write(this.options.thumbsDirectory + filename); // save
        } catch(e) {
            console.log("That doesn't become a thumbnail: " + filename, e);
            return {
                error: e,
                _exif:{tags:{}}
            };
        }
    }
}

export default Thumb;
