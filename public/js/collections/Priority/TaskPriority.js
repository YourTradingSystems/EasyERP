define([
   "models/Priority"
],
    function (PriorityModel) {
        var taskPriorityCollection = Backbone.Collection.extend({
            model: PriorityModel,

            url: function () {
                return "/Priority";
            },

            initialize: function () {
                
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
                console.log("Persons fetchSuccess");
            },
            fetchError: function (error) {

            }

        });

        return taskPriorityCollection;
    });