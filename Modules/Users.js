// JavaScript source code
var Users = function (logWriter, mongoose) {

    //var fs = require("fs"),
    //mongoose = require('mongoose'),
    var crypto = require('crypto');

    var userSchema = mongoose.Schema({
        login: { type: String, default: 'demoUser' },
        email: { type: String, default: '' },
        pass: { type: String, default: '' },
        profile: {
            company: {
                id: { type: String, default: '' },
                name: { type: String, default: '' }
            },
            profile: {
                id: { type: String, default: '' },
                name: { type: String, default: '' }
            }
        }
    }, { collection: 'Users' });

    var User = mongoose.model('Users', userSchema);

    return {

        create: function (data, res) {
            try {
                var shaSum = crypto.createHash('sha256');
                var res = {};
                if (!data) {
                    logWriter.log('Person.create Incorrect Incoming Data');
                    res.send(400, { error: 'User.create Incorrect Incoming Data' });
                    return;
                } else {
                    User.find({ login: data.login }, function (error, doc) {
                        try {
                            if (error) {
                                console.log(error);
                                logWriter.log('User.js create User.find' + error);
                                res.send(500, { error: 'User.create find error' });
                            }
                            if (doc.length > 0) {
                                if (doc[0].ulogin === data.ulogin) {
                                    console.log("An user with the same Login already exists");
                                    res.send(400, { error: "An user with the same Login already exists" });
                                }
                            }
                            else
                                if (doc.length === 0) {
                                    savetoBd(data);
                                }
                        }

                        catch (error) {
                            logWriter.log("User.js. create Account.find " + error);
                            res.send(500, { error: 'User.create find error' });
                        }
                    });
                }
                function savetoBd(data) {
                    try {
                        _user = new User();
                        if (data.isUser) {
                            _user.isUser = data.isUser;
                        }
                        if (data.profile) {
                            if (data.profile.company) {
                                if (data.profile.company._id) {
                                    _user.profile.company.id = data.profile.company._id;
                                }
                                if (data.profile.company.name) {
                                    _user.profile.company.name = data.profile.company.name;
                                }
                            }
                            if (data.profile.profile) {
                                if (data.profile.profile._id) {
                                    _user.profile.profile.id = data.profile.profile._id;
                                }
                                if (data.profile.profile.name) {
                                    _user.profile.profile.name = data.profile.profile.name;
                                }
                            }
                        }
                        if (data.login) {
                            _user.login = data.login;
                        }
                        if (data.pass) {
                            shaSum.update(data.pass);
                            _user.pass = shaSum.digest('hex');
                        }

                        if (data.email) {
                            _user.email = data.email;
                        }

                        _user.save(function (err, result) {
                            if (err) {
                                console.log(err);
                                logWriter.log("User.js create savetoBd _user.save " + err);
                                res.send(500, { error: 'User.create save error' });
                            } else {
                                res.send(201, { success: 'A new User crate success' });
                            }
                        });

                    }
                    catch (error) {
                        console.log(error);
                        logWriter.log("User.js create savetoBd" + error);
                        res.send(500, { error: 'User.create save error' });
                    }
                }
            }
            catch (exception) {
                console.log(exception);
                logWriter.log("User.js  " + exception);
                res.send(500, { error: 'User.create save error' });
            }
        },//End create

        login: function (req, data, func) {
            try {
                if (data) {
                    if (data.login || data.email) {
                        User.find({ $or: [{ login: data.login }, { email: data.email }] }, function (err, _users) {
                            try {
                                if (_users && _users.length !== 0) {
                                    //Провірка по username
                                    var shaSum = crypto.createHash('sha256');
                                    shaSum.update(data.pass);
                                    if (((_users[0].login == data.login) || (_users[0].email == data.login)) && (_users[0].pass == shaSum.digest('hex'))) {
                                        req.session.loggedIn = true;
                                        req.session.uId = _users[0]._id;
                                        func(200);
                                    } else {
                                        func(400);
                                    }
                                } else {
                                    if (err) {
                                        console.log(err);
                                        logWriter.log("User.js. login User.find " + err);
                                    }
                                    func(500);
                                }
                            }
                            catch (error) {
                                logWriter.log("User.js. login User.find " + error);
                                func(500);
                            }
                        }); //End find method
                    }
                    //End Validating input data for login
                }
                else {
                    console.log("Incorect Incoming Data");
                    func(400);
                }//End If data != null
            }
            catch (exception) {
                logWriter.log("Users.js  login" + exception);
                func(500);
            }
        },//End login

        get: function (response) {
            var res = {};
            res['data'] = [];
            var query = User.find({}, { __v: 0, upass: 0 });
            query.sort({ login: 1 });
            query.exec(function (err, result) {
                if (err) {
                    //func();
                    console.log(err);
                    logWriter.log("Users.js get User.find " + err);
                    response.send(500, { error: 'User get BD error' });
                } else {
                    res['data'] = result;
                    response.send(res);
                }
            });
        },

        update: function (_id, data, res) {
            try {
                delete data._id;
                User.update({ _id: _id }, data, function (err, result) {

                    if (err) {
                        console.log(err);
                        logWriter.log("User.js update profile.update" + err);
                        res.send(500, { error: 'User.update BD error' });
                    } else {
                        res.send(200, { success: 'User updated success' });
                    }
                });
            }
            catch (exception) {
                console.log(exception);
                logWriter.log("Profile.js update " + exception);
                res.send(500, { error: 'User.update BD error' });
            }
        },

        remove: function (_id, res) {
            User.remove({ _id: _id }, function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("Users.js remove user.remove " + err);
                    res.send(500, { error: 'User.remove BD error' });
                } else {
                    res.send(200, { success: 'User remove success' });
                }
            });
        },

        User: User
    };
};

module.exports = Users;