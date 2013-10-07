define([
     "models/ProfileModel"
],
    function (ProfileModel) {
        var ProfilesCollection = Backbone.Collection.extend({
            model: ProfileModel,
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
                    error: this.fetchError
                });
            },
            parse: true,

            parse: function (response) {
                return response.data;
            },

            fetchSuccess: function (collection, response) {
            },
            fetchError: function (error) {
            }
        });

        return ProfilesCollection;
    });