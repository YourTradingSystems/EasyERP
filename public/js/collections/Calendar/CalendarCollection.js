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
                    reset: true
                });
            },

            parse: true,

            parse: function (response) {
                return response.data;
            }
        });

        return CalendarCollection;
    });