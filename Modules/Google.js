var googleModule = function (users) {

    var googleapis = require('googleapis'),
	request = require('request'),
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
    function getXML(res,link) {
		link = link.replace("basic","full")+"?alt=json";
		request({url:link,json:true}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var event=[];
				for (var i in body.feed.entry){

					var content = body.feed.entry[i].content.$t;
					var startDate = new Date(body.feed.entry[i].gd$when[0].startTime).toISOString();
					var endDate = new Date(body.feed.entry[i].gd$when[0].endTime).toISOString();
					var subject = body.feed.entry[i].author[0].name.$t
					event.push({"id":body.feed.entry[i].id.$t.split("/")[6],"summary":body.feed.entry[i].title.$t,"description":content,start:{"dateTime":startDate},end:{"dateTime":endDate},"title":subject});
				}
				var calendar = {"id":body.feed.id.$t.split("/")[6],"summary":body.feed.title.$t,"description":body.feed.subtitle.$t,"summary":body.feed.title.$t,"link":link}
				calendar.items = event;
				data=[calendar]
				events.googleCalSync(data,res)
			}
		});
	}

    var getToken = function(req, res) {
        if (checkSessionForToken(req)) {
            return req.sessions.googleToken;
        } else {
            var query = req.query;
            console.log(query);
            if (!query.hasOwnProperty('code')) {
                res.redirect(url);
            } else {
                oauth2Client.getToken(query.code, function(err, tokens) {
                    // contains an access_token and optionally a refresh_token.
                    // save them permanently.
                    if (req.sessions && req.sessions.loggedIn) {
                        writeTokenToDb(req.sessions.uId, tokens.access_token);
                        req.sessions.googleToken = tokens.access_token;
                    }
                });
            }
        }
    }
    return {
        getToken: getToken,
		getXML: getXML
    }
};
module.exports = googleModule;
