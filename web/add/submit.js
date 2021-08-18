const FETCH_POST = {
    method: 'POST',
    cache: 'no-cache'
};

export default class SubmitService {
    constructor() {
    }

    async upload(file) {
        //FILL FormData WITH FILE DETAILS.
        var postData = new FormData();
        let config = this.config;

        postData.append("file", file);

        let response = await fetch("/upload", FETCH_POST);
        let data = await response.json();
        return data
    }
}
