'use strict';

var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://localhost:27017/myvoter');
var Schema = mongoose.Schema;

var Vote = new Schema({
		poll_id: Schema.Types.ObjectId,
		option_id: Schema.Types.ObjectId,
		vote_date: Number
});

module.exports = connection.model('Vote', Vote);
