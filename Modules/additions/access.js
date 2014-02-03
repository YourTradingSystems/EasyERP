var access = function (profile, users, models, logWriter) {
    var getAccess = function (req, uId, mid, callback) { 
        models.get(req.session.lastDb - 1, 'Users', users.schema).findById(uId, function (err, user) {
            if (user) {
                models.get(req.session.lastDb - 1, 'Profile', profile).aggregate(
                {
                    $project: {
                        profileAccess: 1
                    }
                },
                {
                    $match: {
                        _id: user.profile
                    }
                },
                {
                    $unwind: "$profileAccess"
                },

                {
                    $match: {
                        'profileAccess.module': mid
                    }
                },

                function (err, result) {
                    return callback({ error: err, result: result })
                }
            );
            } else {
                logWriter.log('access.js users.findById error' + err);
                res.send(500, { error: 'access.js users.findById error' });
            }
        });
    };

    var getReadAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                callback(res.result[0].profileAccess.access.read);
            }
        });
    };
    var getEditWritAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                callback(res.result[0].profileAccess.access.editWrite);
            }
        });

    };
    var getDeleteAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                callback(res.result[0].profileAccess.access.del);
            }
        });
    };

    return {
        getReadAccess: getReadAccess,
        getEditWritAccess: getEditWritAccess,
        getDeleteAccess: getDeleteAccess
    }
};
module.exports = access;
