define(
    function () {
        var authUrl    =   'https://accounts.google.com/o/oauth2/auth?';
        var validURI    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
        var clientId    =   '38156718110.apps.googleusercontent.com';
        var redirectURI    =   'http://localhost:8088';
        var respType        =   'token';
        var scope       = "email%20openid%20https://www.googleapis.com/auth/calendar";
        var userProfileScope = "https://www.googleapis.com/plus/v1/people/me";
        var _url        =   authUrl + 'scope=' + scope + '&client_id=' + clientId + '&redirect_uri=' + redirectURI + '&response_type=' + respType;
		var calendarUrl = "https://www.google.com/calendar/feeds/default/owncalendars/full?orderby=starttime&oauth_consumer_key=localhost";
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
			var url=calendarUrl +"&oauth_token="+ token+"&oauth_timestamp="+expiresIn;
/*			var rsa = new RSAKey();
			rsa.readPrivateKeyFromPEMString("ZmQ5Z3Ngr5Rb-I9ZnjC2m4dF"); //replace with your private key
			var hSig = rsa.signString(url, "sha1");
			var base64_encoded_signature = hex2b64(hSig);*/
			var myUrl = calendarUrl +"&oauth_token="+ token+"&oauth_timestamp="+expiresIn+"&oauth_signature_method=RSA-SHA1";
			$.ajax({
                url: "https://www.googleapis.com/calendar/v3/calendars/?token="+token,
                data: null,
                success: function(response){
                    console.log(response);
                },
				error: function (request, status, error) {
					console.log("Error!!!");
					console.log("https://www.googleapis.com/calendar/v3/users/me/calendarList?token="+token);

				},
                dataType: "jsonp"
            });

			$.ajax({
                url: myUrl,
                data: null,
                success: function(response){
                    console.log(response);
                },
				error: function (request, status, error) {
					console.log("Error!!!");
					console.log(myUrl);

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
                type:"GET",
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
