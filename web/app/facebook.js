
const authorization = {};

async function setLoginState(ev) {
    console.log("Ughh", ev.detail);
    let user = ev.detail.name;
    console.log('Successful login for: ' + user.givenName);
    document.getElementById('nameDiv').hidden = false;
    document.getElementById('loginDiv').hidden = true;
    document.getElementById('nameTarget').innerHTML = user.givenName + " " + user.familyName;
}

document.addEventListener("loggedin", setLoginState);
