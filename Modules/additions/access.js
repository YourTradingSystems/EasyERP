var access = function (profile, users, logWriter) {
    var getReadAccess = function (uId, mid, callback) {
        users.findById(uId, function(err, user) {
            if (user) {
                profile.profile.aggregate(
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
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                    }
                }
            );
            } else {
                logWriter.log('access.js users.findById error' + err);
                res.send(500, { error: 'access.js users.findById error' });
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