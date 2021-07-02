Bash Utils for services and the likes

What we expect for this to run as a service is that:
* There is a user called `photos` with home directory
* That the user has sudo (NOPASSWD) permissions to execute services and the likes.
* The following system variables are in `~/.profile`
    * `export PHOTOS_USER=<something>`
    * `export PHOTOS_PASSWORD=<something>`
    * `export PHOTOS_FACEBOOK_CALLBACK_URL=<something>`
    * `export PHOTOS_FACEBOOK_CLIENT_SECRET=<something>`
    * `export PHOTOS_FACEBOOK_CLIENT_ID=<something>`
* We run it on a MariaDB which resides on a local machine `(192.168.1.154)` and that is coded into the `lib/config.js` file. You may want to change it or put it in some external store 

At some point we want to edit the metadata per photo from the UI, adding missing attributes to photos lacking data or adding keywords too photos for groupings (eg all photos with roads or water)
