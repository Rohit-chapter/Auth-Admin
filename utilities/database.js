/* eslint-disable no-console */

const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb://localhost:27017/sample-database'
  )
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