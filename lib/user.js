import Location from "./location.js";

// INSERT INTO `spatial_test`.`locations` (`username`, `coordinates`) VALUES (NULL, GeomFromText('POINT(40.782710 -73.965310)'));

class User {
   constructor(pool) {
      this.pool = pool;
   }

   /*
      `username` VARCHAR(50) NOT NULL,
      `last_name` VARCHAR(250) NOT NULL,
      `first_name` VARCHAR(100) NOT NULL,
      `email` VARCHAR(250) NULL DEFAULT NULL,
      `admin` ENUM('Y','N') NOT NULL DEFAULT N,
      `password` VARCHAR(50) NULL DEFAULT NULL,
   */
   async findCreate(data) {
      let existing = await this.findByUsername(data.username);
      if (existing) {
         return existing;
      }
      let fields = Object.assign({ admin: "N" }, data);
      let [results] = await this.pool.query('INSERT INTO user SET ?', fields);
      return results.affectedRows == 1 ? fields : null;
   }

   async validate(username, password) {
      let [results] = await this.pool.query('SELECT username, first_name, last_name, admin FROM user WHERE username = ? AND password = PASSWORD(?)', [username, password]);
      if (results && results.length)
         return results[0];
      else {
         return null;
      }
   }

   async findByUsername(username) {
      let [results] = await this.pool.query('SELECT username, first_name, last_name, admin FROM user where username = ?', username);
      if (results && results.length)
         return results[0];
      else {
         return null;
      }
   }
}

export default User;
