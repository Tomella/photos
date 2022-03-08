import user from "/user.js";

console.log(user);


if(user.name) {
   console.log("User fetched", user);
   document.dispatchEvent(new CustomEvent('loggedin', { detail: user}));

   if(user.admin === 'Y') {
     let addImageCtl = new AddImageCtl(document.querySelector("ph-add-image"));
     addImageCtl.show();
   }
}



function loggedIn(detail) {
    let user = detail.name;
    document.getElementById('nameDiv').hidden = false;
    document.getElementById('nameTarget').innerHTML = user.givenName + " " + user.familyName;
}