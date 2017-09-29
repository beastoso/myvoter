'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PollOption = new Schema({
		option_id: String,
		poll_id: String,
		text: String
});

module.exports = mongoose.model('PollOption', PollOption);
