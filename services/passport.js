/* Setup your local and jwt passport strategies */
const passport = require('passport');
const { User } = require('../models');
const { Strategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };
const jwtOptions = { 
  jwtFromRequest: ExtractJwt.fromHeader('authorization'), 
  secretOrKey: process.env.SECRET
};

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email })
    .then((user) => {
      // return false if no user is found
      if (!user) return done(null, false);
      // if user is found, check if given password is correct
      user.checkPassword(password, (err, isMatch) => {
        if (err) return done(err);
        // if given password doesn't match user password, return false
        if (!isMatch) return done(null, false);
        // finally, return user if given password was correct
        return done(null, user);
      });
    })
    .catch(err => done(err));
});

const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
  // See if the user id in the payload exists in the db 
  User.findById(payload.sub)
    .then((user) => {
      // if no user was found, return false
      if (!user) return done(null, false);
      // if user was found, return user
      return done(null, user);
    })
    .catch(err => done(err, false));
});

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = {
  requireAuth: passport.authenticate('jwt', { session: false }),
  requireSignIn: passport.authenticate('local', { session: false })
};