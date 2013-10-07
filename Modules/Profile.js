var Profile = function (logWriter, mongoose) {

    var ProfileSchema = mongoose.Schema({
        profileName: { type: String, default: 'emptyProfile' },
        profileDescription: { type: String, default: 'No description' },
        profileAccess: [{
            module: {
                mid: { type: Number, default: '' },
                mname: { type: String, default: '' }
            },
            access: { type: [Boolean], default: [false, false, false] }
        }]

    }, { collection: 'Profile' });

    var profile = mongoose.model('Profile', ProfileSchema);

    function create(data, func) {
        try {
            console.log('createProfile');

            if (typeof (data.profileName) == 'undefined') {
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
                    if ((typeof (data.profileName) != 'undefined') && (data.profileName != null)) {
                        _profile.profileName = data.profileName;
                    }
                    if ((typeof (data.profileDescription) != 'undefined') && (data.profileName != null)) {
                        _profile.profileDescription = data.profileDescription;
                    }
                    if ((typeof (data.profileAccess) != 'undefined') && (data.profileAccess != null)) {
                        if ((typeof (data.profileAccess.module) != 'undefined') && (data.profileAccess.module != null)) {
                            if (typeof (data.profileAccess.module.mid) != 'undefined') {
                                _profile.profileAccess.module.mid = data.profileAccess.module.mid;
                            }
                            if (typeof (data.profileAccess.mname) != 'undefined') {
                                _profile.profileAccess.module.mname = data.profileAccess.module.mname;
                            }
                        }
                        if (typeof (data.profileAccess.access) != 'undefined') {
                            _profile.profileAccess.access = data.profileAccess.access;
                        }
                    }
                    _profile.save(function (err, profilee) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Profile.js saveProfileToDb _profile.save" + err);
                                func(500);
                            }
                            if (profilee) {
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
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Profile.js  create " + Exception);
            res.send(500, { error: 'Profile.create find error' });
        }
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        profile.find({}, function (err, profiles) {
            if (err || profiles.length == 0) {
                if (err) {
                    console.log(err);
                    logWriter.log("Profile.js getProfiles profile.find " + err);
                }
                response.send(404, { error: "Can't find Profile" });
            } else {
                res['data'] = profiles;
                response.send(res);
            }
        });
    };

    function update(_id, data, res) {
        try {
            delete data._id;
            profile.update({ _id: _id }, data, function (err, profilee) {
                if (err) {
                    console.log(err);
                    logWriter.log("Profile.js update profile.update" + err);
                    res.send(500, { error: "Can't update Profile" });
                } else {
                    res.send(200, { success: 'Person updated success' });
                }
            });
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Profile.js update " + Exception);
            res.send(500, { error: Exception });
        }
    };

    function remove(_id, res) {
        profile.remove({ _id: _id }, function (err, profilee) {
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