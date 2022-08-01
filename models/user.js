const mongodb = require('mongodb');

const { getDB } = require('../utilities/database');

class User {

  constructor(firstName, lastName, email, password, id) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this._id = id ? mongodb.ObjectId(id) : null;
  }

  save() {

    const db = getDB();

    return db.collection('users')
      .insertOne(this)
      .then((response) => {
        return response.insertedId.toString();
      })
      .catch((error) => console.log(error));

  }

  static findById(id) {

    const db = getDB();

    const objectId = new mongodb.ObjectId(id);

    return db.collection('users')
      .find({ _id: objectId })
      .next()
      .then((user) => {
        return user;
      })
      .catch((error) => console.log(error));
  }

  static fetchAll() {

    const db = getDB();

    return db.collection('users')
      .find()
      .toArray()
      .then((users) => {
        return users;
      })
      .catch((error) => console.log(error));
  }

}

module.exports = User;