var googleModule = function (users) {

    var googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client;
    var oauth2Client =
        new OAuth2Client('38156718110.apps.googleusercontent.com', 'ZmQ5Z3Ngr5Rb-I9ZnjC2m4dF', 'http://localhost:8088/getGoogleToken');
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'http://www.google.com/calendar/feeds/'
    });

    var writeTokenToDb = function (uId, tokens) {
        users.User.update({ _id: uId }, { $set: { "credentials.refresh_token": tokens.refresh_token, "credentials.access_token": tokens.access_token } }, function (err, response) {
            if (err) {
                console.log(err);
            }
        });
    };
    var sendEventsToGoogle = function (req,res, calendars,checkAsGoogle) {
        checkSessionForToken(req, function (err, response) {
            if (response) {
                oauth2Client.credentials = response;
                googleapis
                    .discover('calendar', 'v3')
                    .execute(function (err, client) {
                        if (err) console.log(err);
                        calendars.forEach(function (_event) {
                            var calendarId = _event.id;
                            _event.items.forEach(function (item) {
								var event = {
                                    "summary": item.summary,
                                    'start': {
                                        "dateTime": item.start_date
                                    },
                                    'end': {
                                        "dateTime": item.end_date
                                    }
								}
                                client.calendar.events.insert({ calendarId: calendarId }, event)
                                    .withAuthClient(oauth2Client).execute(
                                        function (err, result) {
                                            if (result) {
												checkAsGoogle(item._id);
                                                console.log(result);
                                            } else {
                                                console.log(err);
                                            };
                                        });
                            });
                        });
                    });
            } else {
                console.log(err);
            }
        });
    }
    var checkSessionForToken = function (req, callback) {
        console.log('Google Sessions');
        if (req.session && req.session.loggedIn) {

            if (req.session.credentials && req.session.credentials.access_token && req.session.credentials.refresh_token) {
                callback(null, req.session.credentials);

            } else {

                users.User.findById(req.session.uId, function (err, response) {
                    if (response) {
                        if (response.credentials && response.credentials.access_token && response.credentials.refresh_token) {
                            req.session.credentials = response.credentials;


                            callback(null, response.credentials);
                        } else {

                            callback({ "error": "error" }, null);
                        }
                    } else {
                        console.log(err);
                        callback(err, null);

                    }
                });
            }
        }

    };

    var getToken = function (req, res, callback) {
        checkSessionForToken(req, function (err, resp) {
            if (resp) {
                callback(resp);
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
                        if (req.session && req.session.loggedIn) {

                            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                            writeTokenToDb(req.session.uId, tokens);
                            req.session.credentials = tokens;
                            if (callback) callback(tokens.access_token);
                        }
                    });
                }
            }
        });

    };

    var getGoogleCalendars = function (credentials, response) {
        oauth2Client.credentials = credentials;

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
    var getEventsByCalendarIds = function (credentials, iDs, callback) {
        oauth2Client.credentials = credentials;
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
        getEventsByCalendarIds: getEventsByCalendarIds,
        sendEventsToGoogle: sendEventsToGoogle
    }
};
module.exports = googleModule;
