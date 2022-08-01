require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoConnect = require('./utilities/database').mongoConnect;

const authRoutes = require('./routes/auth');

const serverPort = process.env.SERVER_PORT;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

app.use(authRoutes);

mongoConnect(() => {
  app.listen(serverPort);
});

// eslint-disable-next-line no-console
console.log(`Server is running on port: ${serverPort}`);