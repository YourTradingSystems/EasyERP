define([
    'models/SourceOfApplicantsModel'
],
    function (SourceOfApplicantsModel) {
        var SourceOfApplicantsCollection = Backbone.Collection.extend({
            model: SourceOfApplicantsModel,
            url: function () {
                return "/SourcesOfApplicants";
            },

            initialize: function () {
                console.log("SourceOfApplicants Collection Init");

                var mid = 39;

                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    type: 'GET',
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
                console.log("SourceOfApplicants fetchSuccess");
            },

            fetchError: function (error) {

            }

        });

        return SourceOfApplicantsCollection;
    });