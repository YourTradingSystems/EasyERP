define([
    "models/CalendarModel"
],
    function (CalendarModel) {
        var CalendarsCollection = Backbone.Collection.extend({
            model : CalendarModel,
            idAttribute: function(){
                return "_id";
            },
            url: "/Calendars",

            initialize: function () {
                var mid = 39;

                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    reset: true,
                    success: this.fetchSuccess
                });
            },

            parse: false,

            parse: function (response) {
                $.each(response.data, function(index){
                    if(response.data[index].hasOwnProperty('_id')){
                        response.data[index]["id"] = response.data[index]["_id"];
                        //delete response.data[index]["_id"];
                    }

                });
                return response.data;
            },
            fetchSuccess:function(){
                console.log("Calendars fetchSuccess");
            }

        });

        return CalendarsCollection;
    });