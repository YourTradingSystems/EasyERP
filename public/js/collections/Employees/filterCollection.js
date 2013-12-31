define([
    'models/EmployeesModel',
    'common'
],
    function (EmployeeModel, common) {
        var EmployeesCollection = Backbone.Collection.extend({
            model: EmployeeModel,
            url: "/Employees/",
            page: 1,
            initialize: function (options) {
                var that = this;
                this.namberToShow = options.count;
                if (options && options.viewType) {
                    this.url += options.viewType;
                    var viewType = options.viewType;
                    delete options.viewType;
                }

                var filterObject = {};
                for (var i in options) {
                    filterObject[i] = options[i];
                }

                switch (viewType) {
                    case 'thumbnails': {
                        filterObject['count'] = filterObject['count']*2;
                        var addPage = 2;
                        break;
                    }
                    case 'list': {
                        filterObject['page'] = 1;
                        var addPage = 0;
                        break;
                    }
                    default: {
                        var addPage = 1;
                    }
                }

                this.fetch({
                    data: filterObject,
                    reset: true,
                    success: function() {
                        console.log("Employees fetchSuccess");
                        that.page += addPage;
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
                filterObject['page'] = (options && options.page) ? options.page: this.page;
                filterObject['count'] = (options && options.count) ? options.count: this.namberToShow;
                filterObject['letter'] = (options && options.letter) ? options.letter: '';
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
                    _.map(response.data, function (employee) {
                        employee.dateBirth = common.utcDateToLocaleDateTime(employee.dateBirth, true);
                        employee.createdBy.date = common.utcDateToLocaleDateTime(employee.createdBy.date);
                        employee.editedBy.date = common.utcDateToLocaleDateTime(employee.editedBy.date);
                        return employee;
                    });
                }
                this.listLength = response.listLength;
                return response.data;
            }

            
        });

        return EmployeesCollection;
    });
