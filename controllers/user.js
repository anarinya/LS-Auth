const { User } = require('../models');
const getTokenForUser = require('../services/token');
const { requireAuth } = require('../services/passport');

// on successful user creation, generate and send a JWT in the response
const createUser = (req, res) => {
  const user = new User(req.body);
  user.save()
    .then((user) => { res.send({ token: getTokenForUser(user) }); })
    .catch(err => res.send(`Error creating user: ${err}`));
};

// return a list of all users if the provided JWT token is valid
const getUsers = (req, res) => {
  User.find()
    .then(users => res.send(users))
    .catch(err => console.error(err));
};

const getUserByName = (req, res) => {
  User.find({ username: req.params.username })
    .then(user => res.send(user))
    .catch(err => console.error(err));
};

module.exports = (app) => {
  app.get('/users', requireAuth, getUsers);
  app.get('/users/:username', requireAuth, getUserByName);
  app.post('/users', createUser);
  app.post('/signup', createUser);
};
