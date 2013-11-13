define([
    'models/CompaniesModel',
    'common'
],
    function (CompanyModel, common) {
        var CompaniesCollection = Backbone.Collection.extend({
            model: CompanyModel,
            url: function () {
                return "/Companies";
            },

            initialize: function () {
                console.log("Companies Collection Init");
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
            filterByLetter: function(letter){
                var filtered = this.filter(function(data){
                    return data.get("name").first.toUpperCase().startsWith(letter);
                });
                return new CompaniesCollection(filtered);
            },

            parse: true,

            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (company) {
                        if (company.notes) {
                            _.map(company.notes, function (note) {
                            	note.date = common.utcDateToLocaleDateTime(note.date);
                                return note;
                            });
                        }
                      
                        if (company.attachments) {
                            _.map(company.attachments, function (attachment) {
                                attachment.uploadDate = common.utcDateToLocaleDateTime(attachment.uploadDate);
                                return attachment;
                            });
                        }
                        //return company.notes;
                        //return company.attachments;
                        return company;
                    });
                }
                return response.data;
            },

            fetchSuccess: function (collection, response) {
                console.log("Companies fetchSuccess");
            },
            fetchError: function (error) {

            }


        });

        return CompaniesCollection;
    });
