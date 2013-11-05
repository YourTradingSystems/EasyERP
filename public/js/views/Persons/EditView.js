define([
    "text!templates/Persons/EditTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Departments/DepartmentsCollection",
    "common",
    "custom"
],
    function (EditTemplate, CompaniesCollection, DepartmentsCollection, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Persons",
            imageSrc: '',

            initialize: function (options) {
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.personsCollection = options.collection;
                this.render();
            },

            saveItem: function () {
                var self = this;
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var dateBirthSt = $.trim($("#dateBirth").val());
                    var dateBirth = "";
                    if (dateBirthSt) {
                        dateBirth = new Date(Date.parse(dateBirthSt)).toISOString();
                    }

                    var data = {
                        imageSrc: this.imageSrc,
                        name: {
                            first: $('#firstName').val(),
                            last: $('#lastName').val()
                        },
                        dateBirth: dateBirth,
                        department: {
                            id: $("#department option:selected").val(),
                            name: $("#department option:selected").text()
                        },
                        company: {
                            id: $('#companiesDd option:selected').val(),
                            name: $('#companiesDd option:selected').text()
                        },
                        address: {
                            street: $('#addressInput').val(),
                            city: $('#cityInput').val(),
                            state: $('#stateInput').val(),
                            zip: $('#zipInput').val(),
                            country: $('#countryInput').val()
                        },
                        website: $('#websiteInput').val(),
                        jobPosition: $('#jobPositionInput').val(),
                        skype: $('#skype').val(),
                        phones: {
                            phone: $('#phoneInput').val(),
                            mobile: $('#mobileInput').val(),
                            fax: $('#faxInput').val()
                        },
                        email: $('#emailInput').val(),
                        salesPurchases: {
                            isCustomer: $('#isCustomerInput').is(':checked'),
                            isSupplier: $('#isSupplierInput').is(':checked'),
                            active: $('#isActiveInput').is('checked')
                        }
                    };

                    currentModel.set(data);

                    currentModel.save({}, {
                        headers: {
                            mid: mid
                        },
                        success: function (resp) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function (model, xhr, options) {
                            if (xhr && xhr.status === 401) {
                                Backbone.history.navigate("login", { trigger: true });
                            } else {
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        },
                        wait: true
                    });
                }

            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                }
                else {
                    var currentModel = this.personsCollection.models[itemIndex];
                    this.$el.html(_.template(EditTemplate, {
                        model: currentModel.toJSON(),
                        companiesCollection: this.companiesCollection,
                        departmentsCollection: this.departmentsCollection
                    }));
                    common.canvasDraw({ model: currentModel.toJSON() }, this);
                }
                //common.contentHolderHeightFixer();
                $('#dateBirth').datepicker({
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-1d'
                });
                return this;
            }

        });

        return EditView;
    });