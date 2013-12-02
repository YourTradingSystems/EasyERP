define([
    "text!templates/Companies/EditTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Persons/PersonsCollection",
    "collections/Departments/DepartmentsCollection",
    "common",
    "custom",
    "dataService"
],
    function (EditTemplate, CompaniesCollection, EmployeesCollection, PersonsCollection, DepartmentsCollection, common, Custom, dataService) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Companies",
            imageSrc: '',

            initialize: function (options) {
                this.collection = options.collection;
                this.currentModel = this.collection.getElement();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click #contacts": "editContacts",
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog"
            },

            hideDialog: function () {
                $(".edit-companies-dialog").remove();
            },

            switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            editContacts: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },
            saveItem: function (event) {
                debugger;
                if(event) event.preventDefault();
                var self = this;
                var mid = 39;

                var data = {
                    name: {
                        first: this.$el.find("#name").val(),
                        last: ''
                    },
                    imageSrc: this.imageSrc,
                    email: this.$el.find("#email").val(),
                    phones: {
                        phone: this.$el.find("#phone").val(),
                        mobile: this.$el.find("#mobile").val(),
                        fax: this.$el.find("#fax").val()
                    },
                    address: {
                        street: this.$el.find('#street').val(),
                        city: this.$el.find('#city').val(),
                        state: this.$el.find('#state').val(),
                        zip: this.$el.find('#zip').val(),
                        country: this.$el.find('#country').val()
                    },
                    website: this.$el.find('#website').val(),
                    internalNotes: $.trim(this.$el.find("#internalNotes").val()),

                    salesPurchases: {
                        isCustomer: this.$el.find("#isCustomer").is(":checked"),
                        isSupplier: this.$el.find("#isSupplier").is(":checked"),
                        active: this.$el.find("#active").is(":checked"),
                        salesPerson: this.$el.find('#employeesDd option:selected').val()===""?null:this.$el.find('#employeesDd option:selected').val(),
                        salesTeam: this.$el.find("#departmentDd option:selected").val()===""?null:this.$el.find("#departmentDd option:selected").val(),
                        reference: this.$el.find("#reference").val(),
                        language: this.$el.find("#language").val()
                    }
                };
                console.log(data);

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        $(".edit-companies-dialog").remove();
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        $(".edit-companies-dialog").remove();
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            template: _.template(EditTemplate),

            render: function () {
                console.log(this.currentModel);

                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: false,
                    dialogClass: "edit-companies-dialog",
                    width: "55%",
                    //height: 513,
                    title: 'Edit Company',
                    buttons: [
                        {
                            text: "Save",
                            click: function () { self.saveItem(); }
                        },{
                        text: "Cancel",
                        click: function () { $(this).dialog().remove(); }
                    }],
                    //closeOnEscape: false,
                    modal: true
                });
			    $('#text').datepicker({ dateFormat: "d M, yy" });
			    common.populateDepartments(App.ID.departmentDd, "/Departments",this.currentModel.toJSON());
			    common.populateEmployeesDd(App.ID.employeesDd, "/Employees",this.currentModel.toJSON());
                this.delegateEvents(this.events);
                common.canvasDraw({ model: this.currentModel.toJSON() }, this);
                this.delegateEvents(this.events);
                return this;
            }

        });

        return EditView;
    });
