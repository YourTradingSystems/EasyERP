// JavaScript source code
var Users = function (logWriter, mongoose) {

    //var fs = require("fs"),
    //mongoose = require('mongoose'),
    var crypto = require('crypto');

    var userSchema = mongoose.Schema({
        ulogin: { type: String, default: 'demoUser' },
        uemail: { type: String, default: '' },
        upass: { type: String, default: '' },
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
                if (data) {
                    logWriter.log('Person.create Incorrect Incoming Data');
                    res.send(400, { error: 'User.create Incorrect Incoming Data' });
                    return;
                } else {
                    User.find({ ulogin: data.ulogin }, function (error, doc) {
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
                        if  (data.profile) {
                            if (data.profile.company) {
                                if (data.profile.company.id) {
                                    _user.profile.company.id = data.profile.company.id;
                                }
                                if(data.profile.company.name) {
                                    _user.profile.company.name = data.profile.company.name;
                                }
                            }
                            if (data.profile.profile) {
                                if (data.profile.profile.id) {
                                    _user.profile.profile.id = data.profile.profile.id;
                                }
                                if (data.profile.profile.name) {
                                    _user.profile.profile.name = data.profile.profile.name;
                                }
                            }
                        }
                        if (data.ulogin) {
                            _user.ulogin = data.ulogin;
                        }
                        if (data.upass) {
                            shaSum.update(data.upass);
                            _user.upass = shaSum.digest('hex');
                        }

                        if (data.uemail)  {
                            _user.uemail = data.uemail;
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
            catch (Exception) {
                console.log(Exception);
                logWriter.log("User.js  " + Exception);
                res.send(500, { error: 'User.create save error' });
            }
        },//End create

        login: function (req, data, func) {
            try {
                if (data != null) {
                    if (data.ulogin || data.uemail) {
                        User.find({ $or: [{ ulogin: data.ulogin }, { uemail: data.uemail }] }, function (err, _users) {
                            try {
                                if (_users && _users.length !== 0) {
                                    //Провірка по username
                                    var shaSum = crypto.createHash('sha256');
                                    shaSum.update(data.upass);
                                    if (((_users[0].ulogin == data.ulogin) || (_users[0].uemail == data.ulogin)) && (_users[0].upass == shaSum.digest('hex'))) {
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
            catch (Exception) {
                logWriter.log("Users.js  login" + Exception);
                func(500);
            }
        },//End login

        get: function (response) {
            var res = {};
            res['data'] = [];
            User.find({}, { __v: 0, upass: 0 }, function (err, result) {
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
            catch (Exception) {
                console.log(Exception);
                logWriter.log("Profile.js update " + Exception);
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