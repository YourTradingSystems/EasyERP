// Filename: app.js
define([
  'router',
   'communication',
   'custom'
], function (Router, Communication, Custom) {
    var initialize = function(){
        var appRouter = new Router();
    	Communication.checkLogin(Custom.runApplication);
    };
    var applyDefaults = function(){
        $.datepicker.setDefaults({
            //dateFormat:"dd/mm/yy"
            firstDay: 1
        });
        //add ability to clear console by calling -> console.API.clear();
        if (typeof console._commandLineAPI !== 'undefined') {
            console.API = console._commandLineAPI;
        } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
            console.API = console._inspectorCommandLineAPI;
        } else if (typeof console.clear !== 'undefined') {
            console.API = console;
        }
        //add startsWith function to strings
        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
				if (str=="All") return true;
				if (str=="0-9")	return !isNaN(parseInt(this[0]));
                return this.indexOf(str) == 0;
            };
        }

        $.extend($.ui.dialog.prototype.options, {
            modal:true,
            resizable: false,
            draggable:true,
            autoOpen:true,
            width:700
        });
    }

    return {
        initialize: initialize,
        applyDefaults:applyDefaults
    }
});
