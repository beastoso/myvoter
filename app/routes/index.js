'use strict';

var path = process.cwd();
var auth = require(path + '/app/config/auth.js');
var VoteHandler = require(path + '/app/common/db-functions.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.session.user) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/login')
		.get(function (req, res) {
			if (req.session.user != null) {
				res.redirect('/profile');
			}
			else {
				res.sendFile(path + '/public/login.html');
			}
		})
		.post(function(req, res) {
			var profile = {
				email: req.body.email,
				password: req.body.password
			}
			auth.login(profile, function(err, user) {
				if (err) {
					res.send(err);
				}
				else {
					req.session.user = user;
					res.redirect('/profile');
				}
			});
		});
	app.route('/signup')
		.get(function (req, res) {
			res.sendFile(path + '/public/signup.html');
		})
		.post(function(req, res) {
			var profile = {
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				newuser: true
			}
			auth.login(profile, function(err, user) {
				if (err) {
					res.send(err);
				}
				else {
					req.session.user = user;
					res.redirect('/profile');
				}
			});
		});

	app.route('/logout')
		.get(function (req, res) {
			req.session.user = null;
			res.redirect('/login');
		});

	app.route('/new')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/new.html');
		});
		
		
	app.route('/vote/:pollId')
		.get(function(req, res) {
			req.session.currentPollId = req.params.pollId;
			res.sendFile(path + '/public/vote.html');
		}).post(function (req, res) {
			var pollId = req.params.pollId,
				optionId = req.body.optionId;
			VoteHandler.saveVote(pollId, optionId, function(err, data) {
				if (err) res.send(err);
				else {
					res.redirect('/results/'+pollId);
				}
			});
		});
	app.route('/profile')
		.get(isLoggedIn, function(req, res) {
			VoteHandler.listPolls(req.session.user._id, function(err, pollsData) {
				if (err) return res.send(err);
				res.sendFile(path + '/public/profile.html');
			});
		});	
	app.route('/api/profile')
		.get(isLoggedIn, function(req, res) {
			VoteHandler.listPolls(req.session.user._id, function(err, pollsData) {
				if (err) {
					return res.send(err);
				}
				if (pollsData != null && pollsData.length > 0) {
					var pollIds = [];
					pollsData.forEach(function(poll) {
						pollIds.push(poll._id);
						poll.votes = 0;
					});
					VoteHandler.getAllVotes(pollIds, function(err, votes) {
						if (err) {
							return res.json(err);
						}
						if (votes != null && votes.length > 0) {
							votes.forEach(function(vote) {
								pollsData.forEach(function(poll) {
									if (vote.poll_id.toString() == poll._id.toString()) {
										poll.votes = vote.count;
										return false;
									}
								});
							});
						}
						res.json({
							name: req.session.user.name,
							polls: pollsData
						});
					});
				}
				else {
					res.json({
						name: req.session.user.name,
						polls: pollsData
					});
				}
			});
		});
		
	app.route('/api/poll/all')
		.get(function(req, res) {
			VoteHandler.listPolls(null, function(err, pollsData) {
				if (err) {
					return res.send(err);
				}
				if (pollsData != null && pollsData.length > 0) {
					var pollIds = [];
					pollsData.forEach(function(poll) {
						pollIds.push(poll._id);
						poll.votes = 0;
					});
					VoteHandler.getAllVotes(pollIds, function(err, votes) {
						if (err) {
							return res.json(err);
						}
						if (votes != null && votes.length > 0) {
							votes.forEach(function(vote) {
								pollsData.forEach(function(poll) {
									if (vote.poll_id.toString() == poll._id.toString()) {
										poll.votes = vote.count;
										return false;
									}
								});
							});
						}
						res.json({
							polls: pollsData
						});
					});
				}
				else {
					res.json({
						polls: pollsData
					});
				}
			});
		});
		
	app.route('/edit/:pollId')
		.get(isLoggedIn, function(req, res) {
			req.session.currentPollId = req.params.pollId;
			res.sendFile(path + '/public/edit.html');
		})
	app.route('/results/:pollId')
		.get(function(req, res) {
			req.session.currentPollId = req.params.pollId;
			res.sendFile(path + '/public/results.html');
		});
	app.route('/api/results/')
		.get(function(req, res) {
			var pollId = req.session.currentPollId;
			VoteHandler.getPoll(pollId, function(err, poll) {
				if (err) return res.send(err);
				if (poll == null) return res.send('could not find poll');
				VoteHandler.getPollOptions(pollId, function(err, options) {
					if (err) return res.send(err);
					poll.options = options;
					VoteHandler.getVotes(pollId, function(err, votes) {
						if (err) return res.send(err);
						poll.votes = votes;
						res.json(poll);
					});
				});
			});
		});
	app.route('/api/poll')
		.get(function(req,res){
			var pollId = req.session.currentPollId;
			VoteHandler.getPoll(pollId, function(err, poll) {
				if (err) return res.send(err);
				if (poll == null) return res.send("could not find poll");
				VoteHandler.getPollOptions(pollId, function(err, options) {
					if (err) return res.send(err);
					poll.options = options;
					res.json(poll);
				});
			});
		})
		.post(isLoggedIn, function (req, res) {
			var userId = req.session.user._id,
				pollName = req.body.name,
				options = req.body.options;
				
			VoteHandler.addPoll(userId, pollName, function(err, data) {
				if (err) res.json(err);
				else {
					var pollId = data._id;
					options.forEach(function(option){
						VoteHandler.addPollOption(userId, pollId, option, function(err, data) {
							if (err) return res.json(err);
						});
					});
					res.json(pollId);
				}
			});
			
		})
		.put(isLoggedIn, function (req, res) {
			var userId = req.session.user._id,
				pollId = req.body.pollId,
				pollName = req.body.name,
				options = req.body.options;
				
			VoteHandler.getPoll(pollId, function(err, poll) {
				if (err) res.json(err);
				else {
					var existingOptions = poll.options;
					options.forEach(function(option){
						var found = false;
						existingOptions.forEach(function(xOption) {
							if (xOption.text == option) {
								found = true;
								return false;
							}
						});
						if (!found) {
							VoteHandler.addPollOption(userId, pollId, option, function(err, data) {
								if (err) return res.json(err);
							});
						}
					});
					res.json(pollId);
				}
			});
			
		});
	app.route('/api/poll/:pollId')
		.delete(isLoggedIn, function(req, res) {
			VoteHandler.deletePoll(req.session.user._id, req.params.pollId, function(err, result) {
				if (err) return res.send(err);
				res.json('success');
			});
		});
};
