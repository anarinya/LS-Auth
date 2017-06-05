const sayHello = (req, res) => {
  res.send('hello');
};

module.exports = (app) => {
  app.get('/', sayHello);
};