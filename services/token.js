/* Export a function that generates the JWT token based off of the user.id */
const jwt = require('jwt-simple');

//require('dotenv').config({ path: '../config.dev.env' });
module.exports = (user) => {
  return jwt.encode({
    sub: user.id,
    iat: new Date().getTime()
  }, process.env.SECRET);
};