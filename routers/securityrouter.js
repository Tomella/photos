import passport from "passport";
import session from "express-session";

import Security from "../lib/usersecurity.js";
import DevSecurity from "../lib/dev-security.js";

class SecurityRouter {
   constructor(config, app, user) {
      this.app = app;

      app.use(session({
         resave: false,
         saveUninitialized: true,
         secret: 'SECRET'
      }));

      app.use(passport.initialize());
      app.use(passport.session());

      passport.serializeUser(function (user, cb) {
         console.log("LUSER1", user)
         cb(null, user);
      });

      passport.deserializeUser(function (obj, cb) {
         console.log("LUSER2", obj)
         cb(null, obj);
      });

      if (config.isLocal.on) {
         this.security = new DevSecurity(config);
      } else {
         this.security = new Security(user, passport);
      }


      app.post('/login', passport.authenticate('local', { failureRedirect: '/?success=login_failed' }),
         function (req, res) {
            res.redirect('/?success=true');
         }
      );

      app.all('/logout', async (req, res) => {
         req.logout();
         res.redirect('/');
      });

      app.all('/user.js', async (req, res) => {
         let response = this.security.user(req);
         let str = "export default " + JSON.stringify(response);
         res.setHeader('Content-Type', "application/javascript; charset=UTF-8");
         res.send(str);
      });
   }
}

export default SecurityRouter;
