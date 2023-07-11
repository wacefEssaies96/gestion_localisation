const Mongoose = require('mongoose');
const urgenceSchema = require('./urgenceSchema');

const Urgence = Mongoose.model(
    "urgence", urgenceSchema
);

module.exports = Urgence;