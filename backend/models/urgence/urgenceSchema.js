const Mongoose = require('mongoose');

const urgenceSchema = new Mongoose.Schema({
    longetude: Number,
    latitude: Number,
    type: String,
    taille: String,
    age: String,
    niveau: Number,
    nbrpersonne: String,
    depart: String,
    nomprenom: String,
    distance: Number,
    status: String,
    tel: Number,
    communication: String,
    police: String
}, { timestamps: true });

module.exports = urgenceSchema;