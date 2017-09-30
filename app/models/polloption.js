'use strict';

var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://localhost:27017/myvoter');
var Schema = mongoose.Schema;

var PollOption = new Schema({
		poll_id: Schema.Types.ObjectId,
		text: String,
		active: String
});

module.exports = connection.model('PollOption', PollOption);
