'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
		poll_id: String,
		name: String,
		description: String
});

module.exports = mongoose.model('Poll', Poll);
