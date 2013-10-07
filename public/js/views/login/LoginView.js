define([
    'text!templates/login/LoginTemplate.html',
    'custom',
    'communication'
], function (LoginTemplate, Custom, Communication) {

    var LoginView = Backbone.View.extend({
        el: '#wrapper',
        initialize: function(){
            this.render();
        },
        events: {
        	"submit #loginForm": "login"
        },
        render: function(){
            this.$el.html(LoginTemplate);
            return this;
        },
        login: function(event){
        	event.preventDefault();
        	var data = {
        			ulogin: this.$("#ulogin").val(),
        			upass: this.$("#upass").val()
        	};
        	$.ajax({
        	    url: "/login",
        	    type: "POST",
        	    data: data,
        	    success: function () {
        	            Custom.runApplication(true);
        	    },
        	    error: function () {
        	        Custom.runApplication(false, "Server is unavailable...");
        	    }
        	});
        }
    });

    return LoginView;

});