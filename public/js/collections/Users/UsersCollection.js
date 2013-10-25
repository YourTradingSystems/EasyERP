define([
    "models/UserModel"
],
    function (UserModel) {

        var UsersCollection = Backbone.Collection.extend({
            model: UserModel,
            url: function () {
                return "/Users";
            },
            initialize: function () {
                var mid = 39;

                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    reset: true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },
            parse: true,
            parse: function (response) {
                return response.data;
            },

            fetchSuccess:function(){
                console.log("Users fetchSuccess");
            },
            fetchError: function (error) {
            }
        });

        return UsersCollection;
    });