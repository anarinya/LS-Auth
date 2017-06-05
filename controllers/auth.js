const { requireSignIn } = require('../services/passport');
const getTokenForUser = require('../services/token');

const signIn = (req, res) => {
  // generate a JWT token if the username/password is valid
  res.send({ token: getTokenForUser(req.user) });
};

module.exports = (app) => {
  app.post('/signin', requireSignIn, signIn);
};
