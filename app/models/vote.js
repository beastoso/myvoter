'use strict';

var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://beastoso:hard24get@ds155674.mlab.com:55674/beastoso-myvoter');
var Schema = mongoose.Schema;

var Vote = new Schema({
		poll_id: Schema.Types.ObjectId,
		option_id: Schema.Types.ObjectId,
		vote_date: Number
});

module.exports = connection.model('Vote', Vote);
