define([
    'models/PersonsModel',
    'common'
],
    function (PersonModel, common) {
        var TasksCollection = Backbone.Collection.extend({
            model: PersonModel,
            url: "/Persons/",
            page: 1,
            initialize: function (options) {
                var that = this;
                if (options && options.viewType) {
                    this.url += options.viewType;
                    delete options.viewType;
                }
                var filterObject = {};
                for (var i in options) {
                    filterObject[i] = options[i];
                };
                this.fetch({
                    data: filterObject,
                    reset: true,
                    success: function() {
                        console.log("Persons fetchSuccess");
                        that.page += 1;
                    },
                    error: this.fetchError
                });
            },
            filterByWorkflow: function (id) {
                return this.filter(function (data) {
                    return data.get("workflow")._id == id;
                });
            },
            showMore: function (options) {
                var that = this;
                
                var filterObject = {};
                if (options) {
                    for (var i in options) {
                        filterObject[i] = options[i];
                    }
                }
                filterObject['page'] = (filterObject.hasOwnProperty('page')) ? filterObject['page'] : this.page;
                filterObject['count'] = (filterObject.hasOwnProperty('count')) ? filterObject['count'] : 10;
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmore', models);
                    },
                    error: function() {
                        alert('Some Error');
                    }
                });
            },

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (person) {
                        person.createdBy.date = common.utcDateToLocaleDateTime(person.createdBy.date);
                        person.editedBy.date = person.editedBy.user ? common.utcDateToLocaleDateTime(person.editedBy.date) :  null;
                        person.dateBirth = common.utcDateToLocaleDate(person.dateBirth);
                        person.salesPurchases.date.createDate = common.utcDateToLocaleDateTime(person.salesPurchases.date.createDate);
                        person.salesPurchases.date.updateDate = common.utcDateToLocaleDateTime(person.salesPurchases.date.updateDate);
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

            
        });

        return TasksCollection;
    });