'use strict';

var User = require('../models/user');
var md5 = require('js-md5');

function hashPwd(password) {
    var hash = md5.create();
	hash.update(password+'mySalt01');
	return hash.hex();
}

module.exports = {
	login: function(profile, done) {
	    User.findOne({ 'email': profile.email }, function (err, user) {
				if (err) {
					return done(err, null);
				}

				if (user) {
				     if (user.password == hashPwd(profile.password)) {
					return done(null, user);
				     }
				     else if (profile.newuser == true) {
				         return done('User exists with different password');
				     }
				     else {
				         return done('Incorrect password');
				     }
				} else {
					var newUser = new User();

					newUser.id = new Date().getTime();
					newUser.name = (profile.name == null ? profile.email : profile.name);
					newUser.email = profile.email;
					
					if (profile.password.trim().length < 5) {
					    return done('Invalid password');
					}
					newUser.password = hashPwd(profile.password);

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
	}
};
