define([
    "text!templates/Persons/EditTemplate.html",
    "common",
    "custom",
    "dataService"
],
    function (EditTemplate, common, Custom, dataService) {

        var EditView = Backbone.View.extend({
            contentType: "Persons",
            imageSrc: '',
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },

            events: {
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideNewSelect",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit"
            },
            hideDialog: function () {
                $('.edit-person-dialog').remove();
            },
            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display: "block"
                }, 250);

            },
            hideEdit: function () {
                $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

            },
            saveItem: function (event) {
                event.preventDefault();
                var self = this;
                var mid = 39;

                var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                var dateBirth = this.$el.find("#dateBirth").val();
                var company = $('#companiesDd option:selected').val();
                company = (company) ? company : null;

                var department = $("#department option:selected").val();
                department = (department) ? department : null;

                var jobPosition = $.trim(this.$el.find('#jobPositionInput').val());
                jobPosition = (jobPosition) ? jobPosition : null;

                var data = {
                    imageSrc: this.imageSrc,
                    name: {
                        first: $.trim(this.$el.find('#firstName').val()),
                        last: $.trim(this.$el.find('#lastName').val())
                    },
                    dateBirth: dateBirth,
                    department: department,
                    company: company,
                    address: {
                        street: $.trim(this.$el.find('#addressInput').val()),
                        city: $.trim(this.$el.find('#cityInput').val()),
                        state: $.trim(this.$el.find('#stateInput').val()),
                        zip: $.trim(this.$el.find('#zipInput').val()),
                        country: $.trim(this.$el.find('#countryInput').val())
                    },
                    website: $.trim(this.$el.find('#websiteInput').val()),
                    jobPosition: jobPosition,
                    skype: $.trim(this.$el.find('#skype').val()),
                    phones: {
                        phone: $.trim(this.$el.find('#phoneInput').val()),
                        mobile: $.trim(this.$el.find('#mobileInput').val()),
                        fax: $.trim(this.$el.find('#faxInput').val())
                    },
                    email: $.trim(this.$el.find('#emailInput').val()),
                    salesPurchases: {
                        isCustomer: $('#isCustomerInput').is(':checked'),
                        isSupplier: $('#isSupplierInput').is(':checked'),
                        active: $('#isActiveInput').is(':checked')
                    }
                };

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        $('.edit-person-dialog').remove();
                        Backbone.history.navigate("easyErp/Persons", { trigger: true });
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
            
            showNewSelect: function (e) {
                var s = "<ul class='newSelectList'>";
                $(e.target).parent().find("select option").each(function () {
                    s += "<li>" + $(this).text() + "</li>";
                });
                s += "</ul>";
                $(".newSelectList").remove();;
                $(e.target).parent().append(s);
                return false;
            },
    
            hideNewSelect: function (e) {
                $(".newSelectList").remove();;
            },
            chooseOption: function (e) {
                var k = $(e.target).parent().find("li").index($(e.target));
                $(e.target).parents("dd").find("select option:selected").removeAttr("selected");
                $(e.target).parents("dd").find("select option").eq(k).attr("selected", "selected");
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text());
            },
            styleSelect: function (id) {
                var text = $(id).find("option:selected").length == 0 ? $(id).find("option").eq(0).text() : $(id).find("option:selected").text();
                $(id).parent().append("<a class='current-selected' href='javascript:;'>" + text + "</a>");
                $(id).hide();
            },
            render: function () {
                var self = this;
                console.log('render persons dialog');
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-person-dialog",
                    title: "Edit Person",
                    width: "80%"
                });
                this.$el.find('#dateBirth').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });
                common.populateCompanies(App.ID.companiesDd, "/Companies", this.currentModel.toJSON(), function () { self.styleSelect(App.ID.companiesDd); });
                common.populateDepartments(App.ID.departmentDd, "/Departments", this.currentModel.toJSON(), function () { self.styleSelect(App.ID.departmentDd); });
                this.styleSelect(App.ID.titleDd);
                this.styleSelect(App.ID.tagsDd);
                //                this.populateDropDown("company", App.ID.companiesDd, "/Companies");
                //this.populateDropDown("person", App.ID.assignedToDd, "/getPersonsForDd");
                this.styleSelect("#type");
                this.delegateEvents(this.events);

                common.canvasDraw({ model: this.currentModel.toJSON() }, this);


                return this;
            }

        });

        return EditView;
    });
