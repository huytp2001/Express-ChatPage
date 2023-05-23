const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: {
    type: [String],
  },
  req_friends: {
    type: [String],
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;