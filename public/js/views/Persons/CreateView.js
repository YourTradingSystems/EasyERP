define([
    "text!templates/Persons/CreateTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Persons/PersonsCollection",
    "models/PersonModel",
    "common"
],
    function (CreateTemplate, CompaniesCollection, PersonsCollection, PersonModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Persons",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));
                this.personsCollection = options.collection;


                this.bind('reset', _.bind(this.render, this));
                this.render();
            },


            saveItem: function () {
                var self = this;
                var mid = 39;

                var idCompany = $(this.el).find('#companiesDd option:selected').val();
                var company = common.toObject(idCompany, this.companiesCollection);

                var data = {
                    name: {
                        first: $('#firstName').val(),
                        last: $('#lastName').val()
                    },
                    company: company,
                    address: {
                        street1: $('#addressInput').val(),
                        street2: $('#additional').val(),
                        city: $('#cityInput').val(),
                        state: $('#stateInput').val(),
                        zip: $('#zipInput').val(),
                        country: $('#countryInput').val()
                    },
                    website: $('#websiteInput').val(),
                    jobPosition: $('#jobPositionInput').val(),
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

                var model = new PersonModel();
                model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        if (xhr && xhr.status === 401) {
                            Backbone.history.navigate("login", { trigger: true });
                        } else {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    }
                });

            },

            render: function () {
                this.$el.html(this.template({ companiesCollection: this.companiesCollection }));
                return this;
            }

        });

        return CreateView;
    });