define([
    "models/PersonModel",
    'common'
],
    function (PersonModel, common) {
        var PersonsCollection = Backbone.Collection.extend({
            model: PersonModel,
            idAttribute: "_id",
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

            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (person) {
                        person.dateBirth = common.utcDateToLocaleDate(person.dateBirth);
                        person.salesPurchases.date.createDate = common.utcDateToLocaleDate(person.salesPurchases.date.createDate);
                        person.salesPurchases.date.updateDate = common.utcDateToLocaleDate(person.salesPurchases.date.updateDate);
                        return person;
                    });
                }
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