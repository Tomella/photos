export default {
    map: {
        id: "mapEdit",
        showLatLon: true,
        options: {
            center: [-34.454, 138.81],
            minZoom: 5,
            zoom: 8,
            maxZoom: 15
        },
        layers: [
            {
                type: "tileLayer",
                url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                options: {
                    maxZoom: 20,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    subdomains: ['a', 'b', 'c']
                }
            }
        ]
    },

    tracker: {
        thumbsPath: "https://photos.geospeedster.com/photos/thumbs/",
        photosPath: "https://photos.geospeedster.com/photos/"
    }
};
