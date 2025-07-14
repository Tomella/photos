import user from "/user.js";
/*
export default {
    "username": "larry",
    "name": {
        "givenName": "Larry",
        "familyName": "Hill"
    },
    "admin": "Y"
}
*/
export default class User {
    constructor(element, handler) {
        initialise();
    }

    hasSession() {
        return user ? !!user.name : false 
    }
}

async function initialise() {
    if (user.name) {
        console.log("User fetched", user);
        document.dispatchEvent(new CustomEvent('usersession', { detail: user }));
    } else {
        console.log("No user fetched", user);
        
        document.dispatchEvent(new CustomEvent('usernosession', { detail: user }));
    }
}
