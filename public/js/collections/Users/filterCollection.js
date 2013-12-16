define([
    'models/UsersModel',
    'common'
],
    function (UserModel, common) {
        var UsersCollection = Backbone.Collection.extend({
            model: UserModel,
            url: "/Users/",
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
                    success: function () {
                        console.log("Users fetchSuccess");
                        that.page += 1;
                    },
                    error: function (models, xhr, optiond) {
                        if ((xhr.status === 401) || (xhr.status === 403)) {
                            window.location = 'logout';
                        }
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
                filterObject['page'] = (filterObject.hasOwnProperty('page')) ? filterObject['page'] : this.page;
                filterObject['count'] = (filterObject.hasOwnProperty('count')) ? filterObject['count'] : 10;
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
                return response.data;
            }


        });

        return UsersCollection;
    });