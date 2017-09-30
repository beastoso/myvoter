'use strict';

var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://localhost:27017/myvoter');
var Schema = mongoose.Schema;

var Poll = new Schema({
		user_id: Schema.Types.ObjectId,
		name: String,
		active: String
});

module.exports = connection.model('Poll', Poll);
