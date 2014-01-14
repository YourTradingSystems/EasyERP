var Profile = function (logWriter, mongoose, models) {
    
    var ProfileSchema = mongoose.Schema({
        _id: Number,
        profileName: { type: String, default: 'emptyProfile' },
        profileDescription: { type: String, default: 'No description' },
        profileAccess: [{
            module: { type: Number, ref: "modules" },
            access: {
                read: { type: Boolean, default: false },
                editWrite: { type: Boolean, default: false },
                del: { type: Boolean, default: false }
            }
        }]

    }, { collection: 'Profile' });

    mongoose.model('Profile', ProfileSchema);

    function createProfile(req, data, res) {
        try {
            console.log('createProfile');
            if (!data.profileName) {
                logWriter.log('Profile.create Incorrect Incoming Data');
                res.send(400, { error: 'Profile.create Incorrect Incoming Data' });
                return;
            } else {
//                console.log(data);
                models.get(req.session.lastDb - 1, "Profile", ProfileSchema).find({ profileName: data.profileName }, function (error, doc) {
                    try {
                        if (error) {
                            console.log(error);
                            logWriter.log("Profile.js create profile.find");
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
                    _profile = new models.get(req.session.lastDb - 1, "Profile", ProfileSchema)({ _id: Date.parse(new Date()) });
                    if (data.profileName) {
                        _profile.profileName = data.profileName;
                    }
                    if (data.profileDescription) {
                        _profile.profileDescription = data.profileDescription;
                    }
                    if (data.profileAccess) {
                        _profile.profileAccess = data.profileAccess.map(function(item){
							item.module=item.module._id;
							console.log(item);
							return item;
						});
                    }
					console.log(_profile);
                    _profile.save(function (err, result) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Profile.js saveProfileToDb _profile.save" + err);
                                res.send(500, {error: "Profile save failed"});
                            }
                            if (result) {
                                console.log("Data Profile saved success");
                                res.send(201, {success:"Profile Saved"});
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

    function getProfile(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, "Profile", ProfileSchema).find({});
        query.sort({profileName: 1 }).
        populate('profileAccess.module');
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
    function getProfileForDd(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, "Profile", ProfileSchema).find({});
        query.select("_id profileName");
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

    function updateProfile(req, _id, data, res) {
        try {
            delete data._id;
            models.get(req.session.lastDb - 1, "Profile", ProfileSchema).update({ _id: _id }, data, function (err, result) {
                if (result) {
                    console.log(" RESULT " + result);
                    res.send(200, { success: 'Profile updated success' });
                } else if(err){
                        logWriter.log("Profile.js update profile.update" + err);
                        res.send(500, { error: "Can't update Profile" });
                    }  else  {
                    res.send(500, { error: "Can't update Profile" });
                }
            });
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Profile.js update " + exception);
            res.send(500, { error: exception });
        }
    };

    function removeProfile(req, _id, res) {
        models.get(req.session.lastDb - 1, "Profile", ProfileSchema).remove({ _id: _id }, function (err, result) {
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
        
        createProfile: createProfile,
        
        getProfile: getProfile,

		getProfileForDd: getProfileForDd,
        
        updateProfile: updateProfile,
        
        removeProfile: removeProfile,
        
        schema: ProfileSchema
    };

};
module.exports = Profile;
