define([
    'models/ProjectsModel'
],
    function (ProjectModel) {
        var ProjectsCollection = Backbone.Collection.extend({
            model: ProjectModel,
            url: function () {
                return "/Projects";
            },

            initialize: function () {
                console.log("Project Collection Init");

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
                console.log("Projects fetchSuccess");
            },
            fetchError: function (error) {

            }


        });

        return ProjectsCollection;
    });