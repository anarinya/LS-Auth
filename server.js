const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

// Environment Config /////////////////////////////////////////
require('dotenv').config({ path: './config.dev.env' });

// CORS Config ////////////////////////////////////////////////
const corsOptions = { origin: process.env.CLIENT_ORIGIN, optionsSuccessStatus: 200 };

// Mongoose Config ////////////////////////////////////////////
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
// catch database connection errors
mongoose.connection.on('error', (err) => {
  console.error(`☠️⚡ DB Connection Error: ${err}`);
});

// App Config /////////////////////////////////////////////////
const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
// additional logging in dev environment
if (process.env.ENV === 'dev') { 
  app.use(morgan("combined")); 
}

// give app access to controllers
require('./controllers')(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});