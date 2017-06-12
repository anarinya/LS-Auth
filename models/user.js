const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (email) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
      }
    },
    required: 'Please provide a valid email address.'
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
});

UserSchema.on('index', function(err) {
  console.log(err);
});

UserSchema.pre('save', function(next) {
  // generate the salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    // hash password
    bcrypt.hash(this.password, salt, null, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      // save user
      next();
    });
  });
});

UserSchema.methods.checkPassword = function(potentialPassword, cb) {
  // use bcrypt to compare the potentialPassword with the user's password
  bcrypt.compare(potentialPassword, this.password, (err, isMatch) => {
    if (err) return cb(`checkPassword Error: ${err}`);
    // return the results in the given callback
    cb(null, isMatch);
  });
};

module.exports = UserSchema;
