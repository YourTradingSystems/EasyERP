define([
    "models/EventModel"
],
    function (EventModel) {
        var EventsCollection = Backbone.Collection.extend({
            model : EventModel,

            url: "/Events",

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
                $.each(response.data, function(index){
                    if(response.data[index].hasOwnProperty('_id')){
                        response.data[index]["id"] = response.data[index]["_id"];
                        //delete response.data[index]["_id"];
                    }

                });
                return response.data;
            }

        });

        return EventsCollection;
    });