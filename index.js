require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const errorController = require('./controllers/errors');

const serverPort = process.env.SERVER_PORT;
const mongodbConnectionString = process.env.MONGODB_CONNECTION_URL;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

app.use(authRoutes);
app.use(userRoutes);

app.use(errorController.handleNotFoundRoutes);

mongoose.connect(mongodbConnectionString)
  .then(() => {
    console.log('Database connected');
    app.listen(serverPort);
  })
  .catch((error) => console.log(error));

// eslint-disable-next-line no-console
console.log(`Server is running on port: ${serverPort}`);