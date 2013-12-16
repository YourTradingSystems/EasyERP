define([
     "models/ProfilesModel"
],
    function (ProfilesModel) {
        var ProfilesCollection = Backbone.Collection.extend({
            model: ProfilesModel,
            url: function () {
                return "/Profiles";
            },
            initialize: function () {
                mid = 39;

                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    reset: true,
                    success: this.fetchSuccess,
                    error: function(models, xhr, options) {
                        if ((xhr.status === 401) || (xhr.status === 403)) {
                            Backbone.history.navigate('#login');
                        }
                    }
                });
            },
            parse: true,

            parse: function (response) {
                return response.data;
            },
            fetchSuccess : function(){
                console.log('Profiles fetch Success');
            }
        });

        return ProfilesCollection;
    });