// JavaScript source code
var Users = function (logWriter, mongoose, models, department) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var newObjectId = mongoose.Types.ObjectId;
    var crypto = require('crypto');
    var collection = 'Users';

    var userSchema = mongoose.Schema({
        imageSrc: { type: String, default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC' },
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
                countPerPage: { type: Number, default: 10 },
				foldWorkflows: [{ type: String, default: '' }]
            },
            applications: {
                countPerPage: { type: Number, default: 10 },
				foldWorkflows: [{ type: String, default: '' }]
            },
            tasks: {
                countPerPage: { type: Number, default: 10 },
				foldWorkflows: [{ type: String, default: '' }]
            }
        },
        RelatedEmployee: { type: ObjectId, ref: 'Employees', default: null }
    }, { collection: 'Users' });

    mongoose.model('Users', userSchema);

    function getAllUserWithProfile(req, id, response) {
        var res = {};
        var query = models.get(req.session.lastDb - 1, 'Users', userSchema).find({profile:id}, {_id:0, login:1});
        query.exec(function (err, result) {
            if (!err) {
                res.count = result.length;
                res.data = result.map(function(item){
					return item.login;
				});
				res.isOwnProfile = res.data.indexOf(req.session.uName)!=-1;
                response.send(res);
            } else {
                logWriter.log("JobPosition.js getTotalCount JobPositions.find " + err);
                response.send(500, { error: "Can't find JobPositions" });
            }
        });
    };

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
                            result.send(201, { success: 'A new User crate success', id: result1._id });
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
                } else {
					console.log("Incorect Incoming Data");
					res.send(400);
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

    function getUsersForDd(req, response) {
        var res = {};
		var data ={};
		for (var i in req.query){
			data[i]=req.query[i];
		}
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
        if (data.sort) {
                query.sort(data.sort);
        }else{
			query.sort({"lastAccess":-1});
		}
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
            console.log(data);
            if (options && options.changePass) {
                delete data.login;
                delete data.profile;
                delete data.email;
                delete data.imageSrc;
                delete data.RelatedEmployee;
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
               // console.log("--->"+JSON.stringify(data, ""));
                for (var i in data) {
                    //commented condition to rewrite empty data
                    // if (data[i]) {
                        updateFields[i] = data[i];
                    //}
                }

                var _object = { $set: updateFields };
                //console.log("--->"+JSON.stringify(_object, ""));
                models.get(req.session.lastDb - 1, 'Users', userSchema).findByIdAndUpdate(_id, _object, function (err, result) {

                    if (err) {
                        console.log(err);
                        logWriter.log("User.js update profile.update" + err);
                        res.send(500, { error: 'User.update BD error' });
                    } else {
                        req.session.kanbanSettings = result.kanbanSettings;
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
		if (req.session.uId == _id){
            res.send(400, { error: 'You cannot delete current user' });
		}
		else
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
		getAllUserWithProfile:getAllUserWithProfile,
		
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
