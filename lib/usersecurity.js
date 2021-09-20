import pkg from "passport-local";
const { Strategy } = pkg;

export default class UserSecurity {
   constructor(users, passport) {
      passport.use(new Strategy(
         async function (username, password, done) {
            let user = await users.validate(username, password);

            console.log("LUSER", user)
            if (!user) {
               return done(null, false, { message: 'Incorrect username.' });
            }
            return done(null, user);
         }
      ));
   }

   user(req) {
      let response = { name: null, admin: "N" };
      let user = req.user;
      if (user) {
         response = { 
            username: user.username,
            name: {
               givenName: user.first_name,
               familyName: user.last_name
            },
            admin: req.user.admin 
         };
      }
      console.log("DDDDD", response);
      return response;
   }

   isAdmin(req) {
      return req.isAuthenticated() && req.user && req.user.admin === "Y";
   }
}

