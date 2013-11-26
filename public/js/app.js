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
    var applyDefaults = function(){
        $.datepicker.setDefaults({
            //dateFormat:"dd/mm/yy"
            firstDay: 1
        });
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
