define(
    function () {
        var Authorized = false;
        var authUrl    =   'https://accounts.google.com/o/oauth2/auth?';
        var validURI    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
        var clientId    =   '38156718110.apps.googleusercontent.com';
        var redirectURI    =   'http://localhost:8088';
        var respType        =   'token';
        var scope       = "openid email https://www.google.com/calendar/feeds/";
        var userProfileScope = "https://www.googleapis.com/plus/v1/people/me?";
        var calendarList = "https://www.googleapis.com/calendar/v3/calendars/";
        var getCalendar = "https://www.googleapis.com/auth/calendar.readonly";
        var _url        =   authUrl + 'scope=' + scope + '&client_id=' + clientId + '&redirect_uri=' + redirectURI + '&response_type=' + respType + '&approval_prompt=force';
        var winObject;
        var acToken;

        var authorize = function(callback){
            var strWindowFeatures = "resizable=yes,width=800, height=600";
            var winObject = window.open(_url, "Google Authorization", strWindowFeatures);
            var pollTimer = window.setInterval(function(){
                if(winObject.document.URL.indexOf(redirectURI) != -1){
                    window.clearInterval(pollTimer);
                    var url = winObject.document.URL;
                    console.log(url);
                    acToken = parseURL(url, 'access_token');
                    var tokenType = parseURL(url, 'token_type');
                    var expiresIn = parseURL(url, 'expires_in');
                    this.Authorized = true;
                    winObject.close();
                    validateToken(acToken, function(resp){
                        callback(resp);
                    });
                }
            }, 100);
        }

        var getCalendarEvents = function(token,email){
			console.log(calendarList + email+"/events?access_token=" + token);
            $.ajax({
                type: "GET",
                url: calendarList + email+"/events?access_token=" + token,
                data: null,
                success: function(response){
                    if(response.error){
                        throw new Error(response.error.message);
                    }
					console.log(response);
                },
                error: function (error){
                    throw new Error(error.message);
                },
                dataType: "jsonp"
            });
        }

        var parseURL = function(url, name){
            name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
            var regexS = "[\#?&]"+name+"=([^&#]*)";
            var regex = new RegExp( regexS );
            var results = regex.exec(url);
            if( results == null )
                return "";
            else
                return results[1];
        }

        var validateToken = function(token, callback){
            $.ajax({
                type:"GET",
                url: validURI + token,
                data: null,
                success: function(response){
                    console.log(response);
                    getCalendarEvents(token,response["email"]);
                    callback(response);
                },
                dataType: "jsonp"
            });
        }


        return {
            Authorize: authorize,
            Authorized: Authorized,
            getCalendarEvents:getCalendarEvents
        }
    });
