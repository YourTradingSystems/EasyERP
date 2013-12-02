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

            filterByLetter: function(letter){
                var filtered = this.filter(function(data){
                    return data.get("name").first.toUpperCase().startsWith(letter);
                });
                return new PersonsCollection(filtered);
            },

            parse:true,

            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (person) {
                        person.dateBirth = common.utcDateToLocaleDate(person.dateBirth);
                        person.salesPurchases.date.createDate = common.utcDateToLocaleDate(person.salesPurchases.date.createDate);
                        person.salesPurchases.date.updateDate = common.utcDateToLocaleDate(person.salesPurchases.date.updateDate);
                        if (person.notes) {
                            _.map(person.notes, function (note) {
                            	note.date = common.utcDateToLocaleDate(note.date);
                                return note;
                            });
                        }
                      
                        if (person.attachments) {
                            _.map(person.attachments, function (attachment) {
                                attachment.uploadDate = common.utcDateToLocaleDate(attachment.uploadDate);
                                return attachment;
                            });
                        }
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
