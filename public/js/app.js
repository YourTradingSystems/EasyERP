// Filename: app.js
define([
  'router',
   'communication',
   'custom'
], function(Router, Communication, Custom){
    var initialize = function(){
        var appRouter = new Router();
    	Communication.checkLogin(Custom.runApplication);
    };

    return {
        initialize: initialize
    }
});
