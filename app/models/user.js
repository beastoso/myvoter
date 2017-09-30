'use strict';

var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://localhost:27017/myvoter');
var Schema = mongoose.Schema;

var User = new Schema({
		name: String,
		email: String,
    password: String
});

module.exports = connection.model('User', User);
