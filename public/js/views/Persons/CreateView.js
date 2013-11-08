define([
    "text!templates/Persons/CreateTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Persons/PersonsCollection",
    "collections/Departments/DepartmentsCollection",
    "models/PersonsModel",
    "common"
],
    function (CreateTemplate, CompaniesCollection, PersonsCollection, DepartmentsCollection, PersonModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Persons",
            template: _.template(CreateTemplate),
            imageSrc: '',

            initialize: function (options) {
                this.personsCollection = options.collection;
                this.bind('reset', _.bind(this.render, this));
                this.render();
            },


            saveItem: function () {
                var self = this;
                var mid = 39;

                var company = $('#companiesDd option:selected').val();
                var dateBirth = $.trim($("#dateBirth").val());
                var department = $("#departmentDd option:selected").val();
                var data = {
                    name: {
                        first: $('#firstName').val(),
                        last: $('#lastName').val()
                    },
                    imageSrc: this.imageSrc,
                    dateBirth: dateBirth,
                    company: company,
                    department: department,
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

                var model = new PersonModel();
                model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        self.hideDialog();
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
            hideDialog: function () {
                $(".create-person-dialog").remove();
            },

            render: function () {
                var formString = this.template({
                });
				var self = this;
                this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:true,
					dialogClass:"create-person-dialog",
					title: "Edit Person",
					width:"80%",
                    buttons: [
                        {
                            text: "Create",
                            click: function () { self.saveItem(); }
                        },

						{
							text: "Cancel",
							click: function () { $(this).dialog().remove(); }
						}]

                });
                var personModel = new PersonModel();

                common.canvasDraw({ model: personModel.toJSON() }, this);
                //common.contentHolderHeightFixer();
                $('#dateBirth').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-1d'
                });
                common.populateCompanies(App.ID.companiesDd, "/Companies");
                common.populateDepartments(App.ID.departmentDd, "/Departments");
                this.delegateEvents(this.events);


                return this;
            }

        });

        return CreateView;
    });
