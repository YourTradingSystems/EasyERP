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
        users.User.update(uId, { $set: { googleToken: token } }, function (err, response) {
            if (err) {
                console.log(err);
            }
        });
    };
    var checkSessionForToken = function (req) {
        console.log('Google Sessions');
        if (req.session && req.session.loggedIn) {
            if (req.session.googleToken) {

                return true;
            } else {
                users.User.findById(req.session.uId, function (err, response) {
                    if (response) {
                        if (response.googleToken) {
                            req.session.googleToken = response.googleToken;
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
    };

    var getToken = function (req, res, callback) {
        if (checkSessionForToken(req)) {
            callback(req.session.googleToken);
        } else {
            var query = req.query;
            console.log(query);
            if (!query.hasOwnProperty('code')) {
                res.redirect(url);
            } else {
                console.log('>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                oauth2Client.getToken(query.code, function (err, tokens) {
                    // contains an access_token and optionally a refresh_token.
                    // save them permanently.
                    console.log(tokens);
                    //if (req.session && req.session.loggedIn) {

                    //    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    //    writeTokenToDb(req.session.uId, tokens.access_token);
                    //    req.session.googleToken = tokens.access_token;
                    //    if (callback) callback(tokens.access_token);
                    //}
                });
            }
        }
    };

    var getGoogleCalendars = function (token, response) {
        oauth2Client.credentials = {
            access_token: token
        };
        googleapis
            .discover('calendar', 'v3')
            .execute(function (err, client) {
                if (err) console.log(err);
                client.calendar.calendarList.list().withAuthClient(oauth2Client).execute(
                    function (err, result) {
                        if (result) {
                            var calendars = [];
                            for (var i in result.items) {
                                calendars.push({
                                    id: result.items[i].id,
                                    summary: result.items[i].summary
                                });
                            }
                            console.log(calendars);
                            response.send(200, JSON.stringify(calendars));
                        } else {
                            console.log(err);
                            response.send(500, err);
                        }
                    });
            });
    };
    var getEventsByCalendarIds = function (token, iDs, callback) {
        oauth2Client.credentials = {
            access_token: token
        };
        var calendars = [];
        googleapis
            .discover('calendar', 'v3')
            .execute(function (err, client) {
                if (err) console.log(err);
                iDs.forEach(function (id) {
                    client.calendar.calendarList.get({ calendarId: id }).withAuthClient(oauth2Client).execute(
                    function (err, result) {
                        if (result) {
                            client.calendar.events.list({ calendarId: id }).withAuthClient(oauth2Client).execute(
                                function (err, events) {
                                    if (events) {
                                        //console.log(result);
                                        result.items = events.items;
                                        calendars.push(result);
                                        if (calendars.length == iDs.length) {
                                            console.log(calendars);
                                            callback(calendars);
                                        };
                                    } else {
                                        console.log(err);
                                        response.send(500, err);
                                    }
                                });
                        } else {
                            console.log(err);
                        }
                    });
                });
            });
    }
    return {
        googleapis: googleapis,
        oauth2Client: oauth2Client,
        getGoogleCalendars: getGoogleCalendars,
        getToken: getToken,
        getEventsByCalendarIds: getEventsByCalendarIds
    }
};
module.exports = googleModule;
