import User from "/lib/user.js";

let user = new User();


console.log("1", user.hasSession());

document.addEventListener("usersession", (ev) => {
  console.log("EvS", ev)
});

console.log("2");

document.addEventListener("usernosession", (ev) => {
  console.log("EvN", ev)
});


console.log(user);



function loggedIn(detail) {
    let user = detail.name;
    document.getElementById('nameDiv').hidden = false;
    document.getElementById('nameTarget').innerHTML = user.givenName + " " + user.familyName;
}