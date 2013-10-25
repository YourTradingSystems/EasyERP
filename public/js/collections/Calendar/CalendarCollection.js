define(function () {
        var CalendarCollection = Backbone.Collection.extend({

            url: function () {
                return "/Persons";
            },

            initialize: function () {
                var mid = 39;
                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    reset: true,
                    success:this.fetchSuccess
                });
            },

            parse: true,

            parse: function (response) {
                return response.data;
            },
            fetchSuccess: function (collection, response) {
                console.log("Calendar fetchSuccess");
            }
        });

        return CalendarCollection;
    });