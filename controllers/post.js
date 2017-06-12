const { Post } = require('../models');
const { requireAuth } = require('../services/passport');

const createPost = (req, res) => {
  const post = new Post(req.body);
  post.author = req.user._id;

  post.save()
    .then(post => res.send(post))
    .catch(err => res.send(`Error creating post: ${err}`))
};

const getPosts = (req, res) => {
  Post.find()
    .then(posts => res.send(posts))
    .catch(err => console.error(err));
};

const getPostBySlug = (req, res) => {
  Post.find({ slug: req.params.slug })
    .then(post => res.send(post))
    .catch(err => console.error(err));
};

module.exports = (app) => {
  app.get('/blog-posts', requireAuth, getPosts);
  app.get('/blog-posts/:slug', requireAuth, getPostBySlug);
  app.post('/blog-posts', requireAuth, createPost);
};