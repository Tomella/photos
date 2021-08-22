export default class Security {
    constructor() {
    }

    user(req) { 
        let response = {name: null, admin: "N"};
        if(req.user) {
           response =  { name: req.user.name, admin: req.user.admin};
        }
        return response;
    }

    isAdmin(req) {
        return req.isAuthenticated() && req.user && req.user.admin === "Y";
    }
}
