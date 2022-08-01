/* eslint-disable no-console */

const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongodbConnectionString = process.env.MONGODB_CONNECTION_URL;

let db;

const mongoConnect = (callback) => {

  MongoClient.connect(mongodbConnectionString)
    .then((client) => {
      console.log('Connected');
      db = client.db();
      callback(client);
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });

};

const getDB = () => {

  try {

    if (db) {
      return db;
    }

  } catch (exception) {
    throw exception;
  }

};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;