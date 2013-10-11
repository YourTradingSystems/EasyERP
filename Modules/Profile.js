var Profile = function (logWriter, mongoose) {

    var ProfileSchema = mongoose.Schema({
        profileName: { type: String, default: 'emptyProfile' },
        profileDescription: { type: String, default: 'No description' },
        profileAccess: [{
            module: {
                id: { type: Number, default: '' },
                name: { type: String, default: '' }
            },
            access: { type: [Boolean], default: [false, false, false] }
        }]

    }, { collection: 'Profile' });

    var profile = mongoose.model('Profile', ProfileSchema);

    function create(data, func) {
        try {
            console.log('createProfile');
            if (!data.profileName) {
                logWriter.log('Profile.create Incorrect Incoming Data');
                res.send(400, { error: 'Profile.create Incorrect Incoming Data' });
                return;
            } else {
                profile.find({ profileName: data.profileName }, function (error, doc) {
                    try {
                        if (error) {
                            console.log(error);
                            logWriter.log("Profile.js create profile.find " + description);
                            res.send(500, { error: 'Profile.create find error' });
                        }
                        if (doc.length > 0) {
                            console.log("A Profile with the same name already exists");
                            res.send(400, { error: 'A Profile with the same name already exists' });
                        } else if (doc.length === 0) {
                            saveProfileToDb(data);
                        }
                    }
                    catch (error) {
                        logWriter.log("Profile.js create profile.find " + error);
                        res.send(500, { error: 'Profile.create find error' });
                    }
                });
            }
            function saveProfileToDb(data) {
                try {
                    _profile = new profile();
                    if (data.profileName) {
                        _profile.profileName = data.profileName;
                    }
                    if (data.profileDescription) {
                        _profile.profileDescription = data.profileDescription;
                    }
                    if (data.profileAccess) {
                        if (data.profileAccess.module) {
                            if (data.profileAccess.module.mid) {
                                _profile.profileAccess.module.id = data.profileAccess.module.mid;
                            }
                            if (data.profileAccess.mname) {
                                _profile.profileAccess.module.name = data.profileAccess.module.mname;
                            }
                        }
                        if (data.profileAccess.access) {
                            _profile.profileAccess.access = data.profileAccess.access;
                        }
                    }
                    _profile.save(function (err, result) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Profile.js saveProfileToDb _profile.save" + err);
                                func(500);
                            }
                            if (result) {
                                console.log("Data Profile saved sucscess");
                                func(201);
                            }
                        }
                        catch (error) {
                            console.log(error);
                            logWriter.log("Profile.js saveProfileToDb _profile.save" + error);
                            res.send(500, { error: 'Profile.create find error' });
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    logWriter.log("Profile.js saveProfileToDb " + error);
                    res.send(500, { error: 'Profile.create find error' });
                }
            }
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Profile.js  create " + exception);
            res.send(500, { error: 'Profile.create find error' });
        }
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        var query = profile.find({});
        query.sort({profileName: 1 });
        query.exec(function (err, result) {
            if (err || result.length == 0) {
                if (err) {
                    console.log(err);
                    logWriter.log("Profile.js getProfiles profile.find " + err);
                }
                response.send(404, { error: "Can't find Profile" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function update(_id, data, res) {
        try {
            delete data._id;
            profile.update({ _id: _id }, data, function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("Profile.js update profile.update" + err);
                    res.send(500, { error: "Can't update Profile" });
                } else {
                    res.send(200, { success: 'Person updated success' });
                }
            });
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Profile.js update " + exception);
            res.send(500, { error: exception });
        }
    };

    function remove(_id, res) {
        profile.remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Profile.js remove profile.remove " + err);
                res.send(500, { error: "Can't remove Profile" });
            } else {
                res.send(200, { success: 'Profile removed' });
            }
        });
    };

    return {
        ctreate: create,
        
        get: get,
        
        update: update,
        
        remove: remove,
        
        profile: profile
    };

};
module.exports = Profile;