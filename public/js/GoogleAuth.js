define(
    function () {
        var authUrl    =   'https://accounts.google.com/o/oauth2/auth?';
        var validURI    =   ' https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
        var clientId    =   '38156718110.apps.googleusercontent.com';
        var redirectURI    =   'http://localhost:8088'
        var respType        =   'token';
        var scope       = "email%20openid%20https://www.googleapis.com/auth/calendar";
        var userProfileScope = "https://www.googleapis.com/plus/v1/people/me";
        var _url        =   authUrl + 'scope=' + scope + '&client_id=' + clientId + '&redirect_uri=' + redirectURI + '&response_type=' + respType;
		var calendarUrl = "http://www.google.com/calendar/feeds/default/allcalendars/full?orderby=starttime&oauth_consumer_key=localhost:8088";
        var winObject;


        var authorize = function(){

            var strWindowFeatures = "resizable=yes,width=800, height=600";
            var winObject = window.open(_url, "Google Authorization", strWindowFeatures);
            var pollTimer = window.setInterval(function(){
                if(winObject.document.URL.indexOf(redirectURI) != -1){
                    window.clearInterval(pollTimer);
                    var url = winObject.document.URL;
                    console.log(url);
                    var acToken = parseURL(url, 'access_token');
                    console.log(acToken);
                    var tokenType = parseURL(url, 'token_type');
                    var expiresIn = parseURL(url, 'expires_in');
					getAllCalendars(acToken,expiresIn);
                    winObject.close();
                    validateToken(acToken);
                }
            }, 100);
        }
		var getAllCalendars = function(token,expiresIn){
			console.log(calendarUrl +"&oauth_token="+ token+"&oauth_timestamp="+expiresIn);
			$.ajax({
                url: calendarUrl +"&oauth_token="+ token+"&oauth_timestamp="+expiresIn,
                data: null,
                success: function(response){
                    console.log(response);
                },
				error: function (request, status, error) {
					console.log("Error!!!");
					console.log(calendarUrl +"&oauth_token="+ token+"&oauth_timestamp="+expiresIn);

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

        var validateToken = function(token){
            $.ajax({
                url: validURI + token,
                data: null,
                success: function(response){
                    console.log(response);
                },
                dataType: "jsonp"
            });
        }



        return {
            Authorize: authorize
        }
    });
