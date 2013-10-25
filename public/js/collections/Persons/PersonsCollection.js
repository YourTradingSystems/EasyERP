define([
    "models/PersonModel"
],
    function (PersonModel) {
        var PersonsCollection = Backbone.Collection.extend({
            model:PersonModel,
            url: function () {
                return "/Persons";
            },
            initialize: function(){
                var mid = 39;

                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    reset:true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },
            parse:true,

            parse: function(response){
                return response.data;
            },

            fetchSuccess:function(){
                console.log("Persons fetchSuccess");
            },
            fetchError: function(error){
            }
        });

        return PersonsCollection;
    });