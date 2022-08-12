const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  authenticationType: {
    type: String,
    required: true
  },
  accessTokens: [
    {
      token: {
        type: String,
        required: true
      },
      expiresAt: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);