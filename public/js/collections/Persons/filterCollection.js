define([
    'models/PersonsModel',
    'common',
    "dataService"
],
    function (PersonModel, common, dataService) {
        var PersonsCollection = Backbone.Collection.extend({
            model: PersonModel,
            url: "/Persons/",
            page: 1,
            initialize: function (options) {
                var that = this;
               
                this.startTime = new Date();
                this.namberToShow = options.count;

                if (options && options.viewType) {
                    this.url += options.viewType;
                    delete options.viewType;
                }

                this.fetch({
                    data: options,
                    reset: true,
                    success: function () {
                        that.page++;
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) Backbone.history.navigate('#login', { trigger: true });
                    }
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
                filterObject['page'] = (options && options.page) ? options.page : this.page;
                filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;
                filterObject['letter'] = (options && options.letter) ? options.letter : '';
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

            showMoreAlphabet: function (options) {
                var that = this;
                var filterObject = options || {};
                that.page = 1;
                filterObject['page'] = (options && options.page) ? options.page : this.page;
                filterObject['count'] = (options && options.count) ? options.count * 2 : this.namberToShow;
                filterObject['letter'] = (options && options.letter) ? options.letter : '';
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page += 2;
                        that.trigger('showmoreAlphabet', models);
                    },
                    error: function () {
                        alert('Some Error');
                    }
                });
            },

            getAlphabet: function (callback) {
                dataService.getData("/getPersonAlphabet", { mid: 39 }, function (response) {
                    if (callback) {
                        callback(response.data);
                    }
                });
            },
            getListLength: function (callback) {
                dataService.getData("/getPersonListLength", {}, function (response) {
                    console.log(response);
                    callback(response.listLength);
                });
            },
            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (person) {
                        if (person.createdBy)
                            person.createdBy.date = common.utcDateToLocaleDateTime(person.createdBy.date);
                        if (person.editedBy)
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
                this.listLength = response.listLength;
                return response.data;
            }


        });

        return PersonsCollection;
    });
