// JavaScript source code
var Users = function (logWriter, mongoose, models, department) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var newObjectId = mongoose.Types.ObjectId;
    var crypto = require('crypto');
    var collection = 'Users';

    var userSchema = mongoose.Schema({
        imageSrc: { type: String, default: '' },
        login: { type: String, default: '' },
        email: { type: String, default: '' },
        pass: { type: String, default: '' },
        credentials: {
            refresh_token: { type: String, default: '' },
            access_token: { type: String, default: '' }
        },
        profile: { type: Number, ref: "Profile" },
        lastAccess: { type: Date },
        kanbanSettings: {
            opportunities: {
                countPerPage: { type: Number, default: 10 }
            },
            applications: {
                countPerPage: { type: Number, default: 10 }
            },
            tasks: {
                countPerPage: { type: Number, default: 10 }
            }
        },
        RelatedEmployee: { type: ObjectId, ref: 'Employees', default: null }
    }, { collection: 'Users' });

    mongoose.model('Users', userSchema);

    function getTotalCount(req, response) {
        var res = {};
        var query = models.get(req.session.lastDb - 1, 'Users', userSchema).find({}, { __v: 0, upass: 0 });
        query.exec(function (err, result) {
            if (!err) {
                res['count'] = result.length;
                response.send(res);
            } else {
                logWriter.log("JobPosition.js getTotalCount JobPositions.find " + err);
                response.send(500, { error: "Can't find JobPositions" });
            }
        });
    };

    function createUser(req, data, result) {
        try {
            var shaSum = crypto.createHash('sha256');
            var res = {};
            if (!data) {
                logWriter.log('Person.create Incorrect Incoming Data');
                result.send(400, { error: 'User.create Incorrect Incoming Data' });
                return;
            } else {
                models.get(req.session.lastDb - 1, 'Users', userSchema).find({ login: data.login }, function (error, doc) {
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
                    _user = new models.get(req.session.lastDb - 1, 'Users', userSchema)();
                    if (data.profile) {
                        _user.profile = data.profile;
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
                    models.get(req.session.lastDb - 1, 'Users', userSchema).find({ $or: [{ login: data.login }, { email: data.email }] }, function (err, _users) {
                        try {
                            if (_users && _users.length !== 0) {
                                var shaSum = crypto.createHash('sha256');
                                shaSum.update(data.pass);
                                if (((_users[0].login == data.login) || (_users[0].email == data.login)) && (_users[0].pass == shaSum.digest('hex'))) {
                                    req.session.loggedIn = true;
                                    req.session.uId = _users[0]._id;
                                    req.session.uName = _users[0].login;
                                    req.session.kanbanSettings = _users[0].kanbanSettings;
                                    res.cookie('lastDb', data.dbId);
                                    var lastAccess = new Date();
                                    req.session.lastAccess = lastAccess;
                                    models.get(req.session.lastDb - 1, 'Users', userSchema).findByIdAndUpdate(_users[0]._id, { $set: { lastAccess: lastAccess } }, function (err, result) {
                                        if (err) {
                                            logWriter.log("User.js. login User.findByIdAndUpdate " + err);
                                            console.log(err);
                                        }
                                    });
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

    function getUsers(req, response, data) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'Users', userSchema).find({}, { __v: 0, upass: 0 });
        query.populate('profile');
        query.sort({ login: 1 });
        if (data.page && data.count) {
            query.skip((data.page - 1) * data.count).limit(data.count);
        }
        query.exec(function (err, result) {
            if (err) {
                //func();
                console.log(err);
                logWriter.log("Users.js get User.find " + err);
                response.send(500, { error: 'User get DB error' });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    }

    function getUsersForDd(req, response, data) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'Users', userSchema).find();
        query.select("_id login");
        query.sort({ login: 1 });
        if (data.page && data.count) {
            query.skip((data.page - 1) * data.count).limit(data.count);
        }
        query.exec(function (err, result) {
            if (err) {
                //func();
                console.log(err);
                logWriter.log("Users.js get User.find " + err);
                response.send(500, { error: 'User get DB error' });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    }

    function getUserById(req, id, response) {
        var query = models.get(req.session.lastDb - 1, 'Users', userSchema).findById(id);
        query.populate('profile');
        query.populate('RelatedEmployee','imageSrc name');
        
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

    function getFilter(req, response) {
        var res = {};
        res['data'] = [];
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }
        var query = models.get(req.session.lastDb - 1, 'Users', userSchema).find({}, { __v: 0, upass: 0 });
        query.populate('profile');
        query.skip((data.page - 1) * data.count).limit(data.count);
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Users.js getFilter.find " + err);
                response.send(500, { error: "User get DB error" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    }

    function updateUser(req, _id, data, res, options) {
        try {
            delete data._id;
            var updateFields = {};
            
            if (options && options.changePass) {
                var shaSum = crypto.createHash('sha256');
                shaSum.update(data.pass);
                data.pass = shaSum.digest('hex');
                models.get(req.session.lastDb - 1, 'Users', userSchema).findById(_id, function (err, result) {

                    if (err) {
                        console.log(err);
                        logWriter.log("User.js update profile.update" + err);
                        res.send(500, { error: 'User.update BD error' });
                    } else {
                        var shaSum = crypto.createHash('sha256');
                        shaSum.update(data.oldpass);
                        var _oldPass = shaSum.digest('hex');
                        if (result.pass == _oldPass) {
                            delete data.oldpass;
                            updateUser();
                        } else {
                            logWriter.log("User.js update Incorect Old Pass");
                            res.send(500, { error: 'Incorect Old Pass' });
                        }
                    }
                });
            } else updateUser();

            

            function updateUser() {
                for (var i in data) {
                    if (data[i]) {
                        updateFields[i] = data[i];
                    }
                };
                var _object = { $set: updateFields };
                models.get(req.session.lastDb - 1, 'Users', userSchema).findByIdAndUpdate(_id, _object, function (err, result) {

                    if (err) {
                        console.log(err);
                        logWriter.log("User.js update profile.update" + err);
                        res.send(500, { error: 'User.update BD error' });
                    } else {
                        req.session.kanbanSettings = result.kanbanSettings
                        res.send(200, { success: 'User updated success' });
                    }
                });
            }
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Profile.js update " + exception);
            res.send(500, { error: 'User.update BD error' });
        }
    }

    function removeUser(req, _id, res) {
        models.get(req.session.lastDb - 1, 'Users', userSchema).remove({ _id: _id }, function (err, result) {
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
        getTotalCount: getTotalCount,

        createUser: createUser,

        login: login,

        getUsers: getUsers,

        getUserById: getUserById,

        getFilter: getFilter,

        getUsersForDd: getUsersForDd,

        updateUser: updateUser,

        removeUser: removeUser,

        schema: userSchema
    };
};

module.exports = Users;
