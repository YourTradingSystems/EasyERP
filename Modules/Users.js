// JavaScript source code
var Users = function (app, logWriter, mongoose, findCompany) {
    var crypto = require('crypto');

    var userSchema = mongoose.Schema({
        imageSrc: { type: String, default: '' },
        login: { type: String, default: '' },
        email: { type: String, default: '' },
        pass: { type: String, default: '' },
        credentials: {
            refresh_token: { type: String, default: '' },
            access_token: { type: String, default: '' }
        },
        profile: { type: Number, ref: "Profile" }
    }, { collection: 'Users' });

    var User = mongoose.model('Users', userSchema);
    
    //------------------Route for Server----------------------------------------------//
    app.post('/login', function (req, res, next) {
        console.log('>>>>>>>>>>>Login<<<<<<<<<<<<<<');
        data = {};
        data = req.body;
        console.log(data);
        login(req, data, res);
    });

    app.post('/Users', function (req, res) {
        console.log(req.body);
        data = {};
        data.mid = req.headers.mid;
        var user = req.body;
        if (req.session && req.session.loggedIn) {
            createUser(user, res);
        } else {
            res.send(401);
        }
    });

    app.get('/Users', function (req, res) {
        console.log('---------------------getUsers-------------');
        data = {};
        data.mid = req.param('mid');
        if (req.session && req.session.loggedIn) {
            getUsers(res);
        } else {
            res.send(401);
        }
    });

    app.get('/Users/:viewType', function (req, res) {
        console.log('---------------------getUsers-------------');
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }
        var viewType = req.params.viewType;
        if (req.session && req.session.loggedIn) {
            switch (viewType) {
                case "form": getUserById(data.id, res);
                    break;
                default: getFilterUsers(data, res);
                    break;
            }
        } else {
            res.send(401);
        }
        
    });

    app.put('/Users/:viewType/:_id', function (req, res) {
        console.log(req.body);
        var data = {};
        var id = req.param('_id');
        //data._id = req.params('_id');
        data.mid = req.headers.mid;
        var user = req.body;
        if (req.session && req.session.loggedIn) {
            updateUser(id, user, res);
        } else {
            res.send(401);
        }
    });

    app.delete('/Users/:_id', function (req, res) {
        data = {};
        var id = req.param('_id');
        data.mid = req.headers.mid;
        if (req.session && req.session.loggedIn) {
            removeUser(id, res);
        } else {
            res.send(401);
        }
    });
    
    app.delete('/Users/:viewType/:_id', function (req, res) {
        data = {};
        var id = req.param('_id');
        data.mid = req.headers.mid;
        if (req.session && req.session.loggedIn) {
            removeUser(id, res);
        } else {
            res.send(401);
        }
    });
    //------------------END Route for Server----------------------------------------------//

    function createUser(data, result) {
        try {
            var shaSum = crypto.createHash('sha256');
            var res = {};
            if (!data) {
                logWriter.log('Person.create Incorrect Incoming Data');
                result.send(400, { error: 'User.create Incorrect Incoming Data' });
                return;
            } else {
                User.find({ login: data.login }, function (error, doc) {
                    try {
                        if (error) {
                            console.log(error);
                            logWriter.log('User.js create User.find' + error);
                            result.send(500, { error: 'User.create find error' });
                        }
                        if (doc.length > 0) {
                            if (doc[0].login === data.login) {
                                console.log("An user with the same Login already exists");
                                result.send(400, { error: "An user with the same Login already exists" });
                            }
                        }
                        else
                            if (doc.length === 0) {
                                savetoBd(data);
                            }
                    }

                    catch (error) {
                        logWriter.log("User.js. create Account.find " + error);
                        result.send(500, { error: 'User.create find error' });
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

                    if (data.imageSrc) {
                        _user.imageSrc = data.imageSrc;
                    }

                    _user.save(function (err, result1) {
                        if (err) {
                            console.log(err);
                            logWriter.log("User.js create savetoBd _user.save " + err);
                            result.send(500, { error: 'User.create save error' });
                        } else {
                            console.log(result1);
                            result.send(201, { success: 'A new User crate success' });
                        }
                    });

                }
                catch (error) {
                    console.log(error);
                    logWriter.log("User.js create savetoBd" + error);
                    result.send(500, { error: 'User.create save error' });
                }
            }
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("User.js  " + exception);
            result.send(500, { error: 'User.create save error' });
        }
    }//End create

    function login(req, data, res) {
        try {
            if (data) {
                if (data.login || data.email) {
                    User.find({ $or: [{ login: data.login }, { email: data.email }] }, function (err, _users) {
                        try {
                            if (_users && _users.length !== 0) {
                                var shaSum = crypto.createHash('sha256');
                                shaSum.update(data.pass);
                                if (((_users[0].login == data.login) || (_users[0].email == data.login)) && (_users[0].pass == shaSum.digest('hex'))) {
                                    req.session.loggedIn = true;
                                    req.session.uId = _users[0]._id;
                                    req.session.uName = _users[0].login;
                                    res.send(200);
                                } else {
                                    res.send(400);
                                }
                            } else {
                                if (err) {
                                    console.log(err);
                                    logWriter.log("User.js. login User.find " + err);
                                }
                                res.send(500);
                            }
                        }
                        catch (error) {
                            logWriter.log("User.js. login User.find " + error);
                            res.send(500);
                        }
                    }); //End find method
                }
                //End Validating input data for login
            }
            else {
                console.log("Incorect Incoming Data");
                res.send(400);
            }//End If data != null
        }
        catch (exception) {
            logWriter.log("Users.js  login" + exception);
            res.send(500);
        }
    }//End login

    function getUsers(response) {
        var res = {};
        res['data'] = [];
        var query = User.find({}, { __v: 0, upass: 0 });
        query.populate('profile');
        query.sort({ login: 1 });
        query.exec(function (err, result) {
            if (err) {
                //func();
                console.log(err);
                logWriter.log("Users.js get User.find " + err);
                response.send(500, { error: 'User get DB error' });
            } else {
                findCompany.findCompany(result, 0, response);
            }
        });
    }

    function getUserById(id, response) {
        console.log(id);
        var query = User.findById(id);
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Users.js get User.find " + err);
                response.send(500, { error: 'User get DB error' });
            } else {
                response.send(result);
            }
        });
    }

    function getFilterUsers(data, response) {
        var res = {};
        res['data'] = [];
        var query = User.find({}, { __v: 0, upass: 0 });

        query.skip((data.page - 1) * data.count).limit(data.count);
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Users.js getFilterUser.find " + err);
                response.send(500, { error: "User get DB error" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    }

    function updateUser(_id, data, res) {
        try {
            delete data._id;
            var updateFields = {};
            for (var i in data) {
                if (data[i]) {
                    updateFields[i] = data[i]
                }
            };
            var _object = { $set: updateFields }
            User.update({ _id: _id }, _object, function (err, result) {

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
    }

    function removeUser(_id, res) {
        User.remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Users.js remove user.remove " + err);
                res.send(500, { error: 'User.remove BD error' });
            } else {
                res.send(200, { success: 'User remove success' });
            }
        });
    }

    return {
        createUser: createUser,
        login: login,
        getUsers: getUsers,
        getUserById: getUserById,
        getFilterUsers: getFilterUsers,
        updateUser: updateUser,
        removeUser: removeUser,
        User: User
    };
};

module.exports = Users;
