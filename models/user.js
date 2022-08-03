const mongodb = require('mongodb');

const { getDB } = require('../utilities/database');

class User {

  constructor(firstName, lastName, email, password, authenticationType, id, accessTokens) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.authenticationType = authenticationType;
    this._id = id ? mongodb.ObjectId(id) : null;
    this.accessTokens = accessTokens;
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
      .find({ _id: objectId }, { password: 0, accessTokens: 0 })
      .next()
      .then((user) => {
        return user;
      })
      .catch((error) => console.log(error));
  }

  static fetchAll() {

    const db = getDB();

    return db.collection('users')
      .find({}, { password: 0, accessTokens: 0 })
      .toArray()
      .then((users) => {
        return users;
      })
      .catch((error) => console.log(error));
  }

  static findByEmail(email) {

    const db = getDB();

    return db.collection('users')
      .find({ email })
      .next()
      .then((user) => {
        return user;
      })
      .catch((error) => console.log(error));

  }

  static updateUser(user) {

    const db = getDB();

    return db.collection('users')
      .updateOne({ _id: user._id }, { $set: user })
      .then()
      .catch((error) => console.log(error));

  }

}

module.exports = User;