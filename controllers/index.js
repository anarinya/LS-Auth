module.exports = (app) => {
  require('./auth')(app);
  require('./user')(app);
  require('./home')(app);
  require('./post')(app);
};
