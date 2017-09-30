'use strict';

var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://beastoso:hard24get@ds155674.mlab.com:55674/beastoso-myvoter');
var Schema = mongoose.Schema;

var User = new Schema({
		name: String,
		email: String,
    password: String
});

module.exports = connection.model('User', User);
