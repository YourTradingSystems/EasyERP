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
                this.namberToShow = options.count;
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
                    success: function (model,res) {
                        console.log("Persons fetchSuccess");
                        that.page += 1;
                    },
                    error: function (models, xhr, options) {
                        if (xhr.status == 401) Backbone.history.navigate('#login', { trigger: true });
                    }
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
                filterObject['page'] = this.page;
                filterObject['count'] = this.namberToShow;
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmore', models);
                    },
                    error: function () {
                        alert('Some Error');
                    }
                });
            },

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (person) {
                        person.createdBy.date = common.utcDateToLocaleDateTime(person.createdBy.date);
                        person.editedBy.date = person.editedBy.user ? common.utcDateToLocaleDateTime(person.editedBy.date) : null;
                        person.dateBirth = common.utcDateToLocaleDate(person.dateBirth);
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
            }


        });

        return TasksCollection;
    });
