var googleModule = function (users) {

    var googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client;
    var oauth2Client =
        new OAuth2Client('38156718110.apps.googleusercontent.com', 'ZmQ5Z3Ngr5Rb-I9ZnjC2m4dF', 'http://localhost:8088/getGoogleToken');
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'http://www.google.com/calendar/feeds/'
    });

    var writeTokenToDb = function (uId, token) {
        users.update(req.sessions.uId, { $set: { googleToken: token } }, function (err, response) {
            if (err) {
                console.log(err);
            }
        });
    };
    var checkSessionForToken = function (req) {
        if (req.sessions && req.sessions.loggedIn) {
            if (req.sessions.googleToken) {
                
                return true;
            } else {
                users.findById(req.sessions.uId, function (err, response) {
                    if (response) {
                        if (response.googleToken) {
                            req.sessions.googleToken = response.googleToken;
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        console.log(err);
                        return false;
                    }
                });
            }
        }
    }

    var getToken = function (req, res) {
        if (req.sessions && req.sessions.loggedIn) {

        }
        var query = req.query;
        console.log(query);
        if (!query.hasOwnProperty('code')) {
            res.redirect(url);
        } else {
            oauth2Client.getToken(query.code, function (err, tokens) {
                // contains an access_token and optionally a refresh_token.
                // save them permanently.
                oauth2Client.credentials = {
                    access_token: tokens.access_token
                };

            });
        }
    };
    return {
        getToken: getToken
    }
};
module.exports = googleModule;