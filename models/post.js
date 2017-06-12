const mongoose = require('mongoose');
const slug = require('slugs');

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    lowercase: true,
    required: true,
    validate: {
      validator: (title) => {
        return title.trim() ? true : false;
      }
    }
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  body: {
    type: String,
    required: true,
    validate: {
      validator: (body) => {
        return body.trim() ? true : false;
      }
    }
  }
}, {
  timestamps: true
});

function autopopulate(next) {
  // grab the username of the author id tied to the post
  this.populate('author', 'username');
  next();
};

PostSchema.pre('save', function(next) {
  // a slug only needs to be created the first time a post is saved
  if (!this.isModified('title')) {
    return next();
  }
  this.slug = slug(this.title);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  // find any articles that already exist with the same slug, or the same slug with a digit after it
  this.constructor.find({ slug: slugRegEx })
    .then((storesWithSlug) => {
      // add a number to the end of the slug based on how many other similar slugs already exist
      if (storesWithSlug.length) this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
      // save post
      next();
    })
    .catch(err => next(err));
});

PostSchema.pre('find', autopopulate);
PostSchema.pre('findOne', autopopulate);

module.exports = PostSchema;