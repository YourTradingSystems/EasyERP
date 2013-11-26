define(
    function () {
        var authUrl      =   'https://accounts.google.com/o/oauth2/auth?';
        var validURI     =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
        var clientId     =   '38156718110.apps.googleusercontent.com';
        var redirectURI  =   'http://localhost:8088';
        var respType     =   'token';
        var scope        =   "openid email https://www.google.com/calendar/feeds/";
        var calendar     =   "https://www.googleapis.com/calendar/v3/";
        var _url         =    authUrl + 'scope=' + scope + '&client_id=' + clientId + '&redirect_uri=' + redirectURI + '&response_type=' + respType + '&approval_prompt=force';
        var acToken;

        var authorize = function(callback){
            var strWindowFeatures = "resizable=yes,width=800, height=600";
            var winObject = window.open(_url, "Google Authorization", strWindowFeatures);
            var pollTimer = window.setInterval(function(){
                if(winObject.document.URL.indexOf(redirectURI) != -1){
                    window.clearInterval(pollTimer);
                    var url = winObject.document.URL;
                    acToken = parseURL(url, 'access_token');
                    var tokenType = parseURL(url, 'token_type');
                    var expiresIn = parseURL(url, 'expires_in');
                    winObject.close();
                    validateToken(acToken, function(resp){
                        callback(resp);
                    });
                }
            }, 100);
        }

        var loadEventsByOrder = function(calendarlist, callback){
            var token = getFromLocalStorage('token');
            var $myQueue = $('<div/>');
            for (var k = 0, len = calendarlist.length; k < len; k++) {
                (function(i) {
                    $myQueue.queue(function(next) {
                        getCalendarEvents(token, calendarlist[i], function(resp){
                                callback(resp, calendarlist[i]);
                        });

                        next();
                    });

                })(k);
            }

            $myQueue.dequeue();
        }

        var getCalendarsList = function(callback){
            var token = getFromLocalStorage('token');

            $.ajax({
                type: "GET",
                url: calendar + "users/me/calendarList?access_token=" + token,
                data: null,
                success: function(response){
                    if(response.error){
                        throw new Error(response.error.message);
                    } else{
                        callback(response.items);
                    }

                },
                error: function (error){
                    throw new Error(error.message);
                },
                dataType: "jsonp"
            });
        }

        var getCalendarEvents = function(token, calendarId, callback){
			console.log("Calendar Id: " + calendarId);

            $.ajax({
                type: "GET",
                url: calendar + "calendars/" +  calendarId + "/events?access_token=" + token,
                data: null,
                success: function(response){
					if(response)
                        callback(response);
                },
                error: function (error, statusText,sdfdf){
                     callback(statusText);

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
                    saveToLocalStorage('token', token);
                    callback(response);
                    //getCalendarsList(token,callback);
                    //getCalendarEvents(token,response["email"],callback);
                },
                dataType: "jsonp"
            });
        }

        var getFromLocalStorage = function(key){
            if(window.localStorage){
                return window.localStorage.getItem(key);
            } else{
                throw new Error('Failed to save security token to LocalStorage. It is not supported by browser.');
            }
        }

        var saveToLocalStorage = function(key, value){
            if(window.localStorage){
                window.localStorage.setItem(key,value);
            } else{
                throw new Error('Failed to save security token to LocalStorage. It is not supported by browser.');
            }
        }


        return {
            Authorize: authorize,
            LoadCalendarEvents: loadEventsByOrder,
            getCalendarEvents:getCalendarEvents,
            GetCalendarsList:getCalendarsList,
            LoadCalendars: loadEventsByOrder
        }
    });
