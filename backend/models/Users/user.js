const mongoose =require('mongoose');
const userSchema = require('./userSchema');

const User = mongoose.model(
  "User", userSchema
);

module.exports = User;
