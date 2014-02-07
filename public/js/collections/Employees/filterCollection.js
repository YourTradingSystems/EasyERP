define([
    'models/EmployeesModel',
    'common',
    "dataService"
],
    function (EmployeeModel, common, dataService) {
        var EmployeesCollection = Backbone.Collection.extend({
            model: EmployeeModel,
            url: "/Employees/",
            page: 1,
            namberToShow: null,
            viewType: null,
            contentType: null,

            initialize: function (options) {
				this.startTime = new Date();

                var that = this;
                this.namberToShow = options.count;
                this.viewType = options.viewType;
                this.contentType = options.contentType;

                if (options && options.viewType) {
                    this.url += options.viewType;
                    //delete options.viewType;
                }

                this.fetch({
                    data: options,
                    reset: true,
                    success: function() {
                        that.page ++;
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) Backbone.history.navigate('#login', { trigger: true });
                    }
                });
            },

            showMore: function (options) {
                var that = this;

                var filterObject = options || {};



                filterObject['page'] = (options && options.page) ? options.page: this.page;
                filterObject['count'] = (options && options.count) ? options.count: this.namberToShow;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType: this.viewType;
                filterObject['contentType'] = (options && options.contentType) ? options.contentType: this.contentType;
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
            showMoreAlphabet: function (options) {
                var that = this;
                var filterObject = options || {};
				that.page = 1;
                filterObject['page'] = (options && options.page) ? options.page : this.page;
                filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType: this.viewType;
                filterObject['contentType'] = (options && options.contentType) ? options.contentType: this.contentType;
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page ++;
                        that.trigger('showmoreAlphabet', models);
                    },
                    error: function () {
                        alert('Some Error');
                    }
                });
            },

            getAlphabet: function (callback) {
				dataService.getData("/getEmployeesAlphabet", { mid: 39 }, function (response) {
					if (callback){
						callback(response.data);
					}
				});
			},

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (employee) {
                        employee.dateBirth = common.utcDateToLocaleDateTime(employee.dateBirth, true);
						if (!employee.createdBy) employee.createdBy={}
						if (!employee.editedBy) employee.editedBy={}
							employee.createdBy.date = common.utcDateToLocaleDateTime(employee.createdBy.date);
							employee.editedBy.date = common.utcDateToLocaleDateTime(employee.editedBy.date);
                        return employee;
                    });
                }
                return response.data;
            }

            
        });

        return EmployeesCollection;
    });
