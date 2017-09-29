var mongo = require("mongodb");

var CONNECT_URL = 'mongodb://localhost:27017/myvoter';

var self = module.exports = {
  listPolls: function(userId, callback) {
    mongo.connect(CONNECT_URL, function(err, db) {
      if (err) callback(err, null);
      else {
        var collection = db.collection('Poll');
        var matchQuery = {'active':'true'};
        if (userId != null) {
          matchQuery.user_id = new mongo.ObjectId(userId);
        }
        
        collection.find(
          matchQuery
        ).toArray(function(error, documents) {
          if (error) callback(err, null);
          else {
            db.close();
            callback(null, documents);
          }
        });
      }
    });
  },
  addPoll: function(userId, pollName, callback) {
      mongo.connect(CONNECT_URL, function(err, db) {
        if (err) callback(err, null);
        else {
          var collection = db.collection('Poll');
          var document = {'user_id': new mongo.ObjectId(userId), 'name':pollName,'active':'true'};
          collection.insert(document,function(error, documents) {
            if (error) callback(error, null);
            else  {
              db.close();
              callback(null, documents.ops[0]);
            }
          });
        }
      });
  },
  addPollOption: function(userId, pollId, optionText, callback) {
       mongo.connect(CONNECT_URL, function(err, db) {
        if (err) callback(err, null);
        else {
          var collection = db.collection('PollOption');
          var document = {'poll_id': new mongo.ObjectId(pollId), 'text':optionText, 'active':'true'};
          collection.insert(document,function(error, documents) {
            if (error) callback(error, null);
            else  {
              db.close();
              callback(null, documents);
            }
          });
        }
      });
  },
  getPoll: function(pollId, callback) {
    mongo.connect(CONNECT_URL, function(err, db) {
      if (err) callback(err, null);
      else {
        var collection = db.collection('Poll');
        var matchQuery = { '_id': new mongo.ObjectId(pollId), 'active':'true'} ;
        collection.find(
          matchQuery
        ).toArray(function(error, documents) {
          if (error) callback(err, null);
          else {
            db.close();
            if (documents.length > 0) {
              callback(null, documents[0]);
            }
            else {
              callback('Poll not found', null);
            }
          }
        });
        
      }
    });
  },
  getPollOptions: function(pollId, callback) {
    mongo.connect(CONNECT_URL, function(err, db) {
      if (err) callback(err, null);
      else {
        var collection = db.collection('PollOption');
        collection.find(
          {'poll_id': new mongo.ObjectId(pollId), 'active':'true'}
          ).toArray(function(error, documents) {
          if (error) callback(err, null);
          else {
            db.close();
            callback(null, documents);
          }
        });
      }
    });
  },
  saveVote: function(pollId, pollOptionId, callback) {
    mongo.connect(CONNECT_URL, function(err, db) {
        if (err) callback(err, null);
        else {
          var collection = db.collection('Vote');
          var document = {'poll_id': new mongo.ObjectId(pollId), 'option_id':new mongo.ObjectId(pollOptionId), 'vote_date': new Date().getTime()};
          collection.insert(document,function(error, documents) {
            if (error) callback(error, null);
            else  {
              db.close();
              callback(null, documents);
            }
          });
        }
    });
  },
  getVotes: function(pollId, callback) {
    mongo.connect(CONNECT_URL, function(err, db) {
      if (err) callback(err, null);
      else {
        var collection = db.collection('Vote');
        collection.aggregate([
          { "$match": {poll_id: new mongo.ObjectId(pollId) }},
          { "$group": { _id: {option_id: "$option_id"}, count: {$sum: 1} }}
        ]).toArray(function(error, votes) {
          if (error) callback(err, null);
          else {
            db.close();
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
          }
        });
        
      }
    });
  },
  getAllVotes: function(pollIds, callback) {
    mongo.connect(CONNECT_URL, function(err, db) {
      if (err) callback(err, null);
      else {
        var pollObjectIds = [];
        pollIds.forEach(function(pollId) {
          pollObjectIds.push(new mongo.ObjectId(pollId));
        });
        var collection = db.collection('Vote');
        collection.aggregate([
          { "$match": {poll_id: {$in: pollObjectIds }}},
          { "$group": { _id: {poll_id: "$poll_id"}, count: {$sum: 1} }}
        ]).toArray(function(error, votes) {
          if (error) callback(err, null);
          else {
            db.close();
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
          }
        });
        
      }
    });
  },
  deletePoll: function(userId, pollId, callback) {
    mongo.connect(CONNECT_URL, function(err, db) {
      if (err) callback(err, null);
      else {
        var collection = db.collection('Poll');
        collection.find(
          {'poll_id':new mongo.ObjectId(pollId), 'user_id':new mongo.ObjectId(userId)}
        ).toArray(function(error, documents) {
          if (error) callback(err, null);
          else {
            db.close();
            if (documents.length == 0) {
              callback('Poll not found', null);
            }
            else {
              collection.update(
                {'_id':new mongo.ObjectId(pollId)},
                {$set: {'active':'false'}}
                );
                callback(null, true);
            }
          }
        });
      }
    });
  }
};
