'use strict';

var mongo = require("mongodb");

var User = require('../models/user');
var Poll = require('../models/poll');
var PollOption = require('../models/polloption');
var Vote = require('../models/vote');

var self = module.exports = {
  listPolls: function(userId, callback) {
    var matchQuery = {'active':'true'};
    if (userId != null) {
      matchQuery.user_id = new mongo.ObjectId(userId);
    }
    Poll.find(matchQuery).exec(function(err, polls) {
      if (err) return callback(err);
      callback(null, polls);
    });
    
  },
  addPoll: function(userId, pollName, callback) {
      var poll = new Poll(
        {'user_id': new mongo.ObjectId(userId), 'name':pollName,'active':'true'}
      );
      poll.save(function(err) {
        if (err) return callback(err, null);
        callback(null, poll);
      });
  },
  addPollOption: function(userId, pollId, optionText, callback) {
      var option = new PollOption(
        {'poll_id': new mongo.ObjectId(pollId), 'text':optionText, 'active':'true'}
      );
      option.save(function(error) {
            if (error) return callback(error, null);
            callback(null, option);
      });
  },
  getPoll: function(pollId, callback) {
    var matchQuery = { '_id': new mongo.ObjectId(pollId), 'active':'true'} ;
    Poll.findOne(
      matchQuery
    ).exec(function(error, poll) {
      if (error) return callback(error, null);
      if (poll) {
          callback(null, poll);
      }
      else {
          callback('Poll not found', null);
      }
    }); 
  },
  getPollOptions: function(pollId, callback) {
    PollOption.find(
      {'poll_id': new mongo.ObjectId(pollId), 'active':'true'}
    ).exec(function(error, options) {
      if (error) return callback(error, null);
      else {
        callback(null, options);
      }
    });
  },
  saveVote: function(pollId, pollOptionId, callback) {
    var vote = new Vote(
      {'poll_id': new mongo.ObjectId(pollId), 'option_id':new mongo.ObjectId(pollOptionId), 'vote_date': new Date().getTime()}
    );
    vote.save(function(error) {
      if (error) return callback(error, null);
      callback(null, true);
    });
  },
  getVotes: function(pollId, callback) {
    Vote.aggregate([
      { "$match": {poll_id: new mongo.ObjectId(pollId) }},
      { "$group": { _id: {option_id: "$option_id"}, count: {$sum: 1} }}
    ]).exec(function(error, votes) {
      if (error) return callback(error, null);
      var results = [];
      if (votes != null) {
        votes.forEach(function(option) {
          results.push({
            option_id: option._id.option_id,
            count: option.count
          });
        });
      }
      callback(null, results);
    });
  },
  getAllVotes: function(pollIds, callback) {
    var pollObjectIds = [];
    pollIds.forEach(function(pollId) {
      pollObjectIds.push(new mongo.ObjectId(pollId));
    });
    Vote.aggregate([
      { "$match": {poll_id: {$in: pollObjectIds }}},
      { "$group": { _id: {poll_id: "$poll_id"}, count: {$sum: 1} }}
    ]).exec(function(error, votes) {
      if (error) return callback(error, null);
      var results = [];
      if (votes != null) {
        votes.forEach(function(option) {
          results.push({
            poll_id: option._id.poll_id,
            count: option.count
          });
        });
      }
      callback(null, results);
    });
  },
  deletePoll: function(userId, pollId, callback) {
    Poll.findOneAndUpdate(
      {'poll_id':new mongo.ObjectId(pollId), 'user_id':new mongo.ObjectId(userId)},
      {'active':'false'}
    ).exec(function(error) {
      if (error) return callback(error, null);
      callback(null, true);
    });
  }
};
