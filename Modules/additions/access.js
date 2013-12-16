var access = function (profile, users, logWriter) {
    var getAccess = function (uId, mid, callback) {
        users.findById(uId, function (err, user) {
            if (user) {
                profile.aggregate(
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

    var getReadAccess = function (uId, mid, callback) {
        getAccess(uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                console.log(res.result);
                callback(res.result[0].profileAccess.access.read);
            }
        });
    };
    var getEditWritAccess = function (uId, mid, callback) {
        getAccess(uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                console.log(res.result);
                callback(res.result[0].profileAccess.access.editWrite);
            }
        });

    };
    var getDeleteAccess = function (uId, mid, callback) {
        getAccess(uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                console.log(res.result);
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
