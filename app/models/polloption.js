'use strict';

var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://beastoso:hard24get@ds155674.mlab.com:55674/beastoso-myvoter');
var Schema = mongoose.Schema;

var PollOption = new Schema({
		poll_id: Schema.Types.ObjectId,
		text: String,
		active: String
});

module.exports = connection.model('PollOption', PollOption);
