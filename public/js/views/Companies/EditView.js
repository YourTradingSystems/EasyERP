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
                _.bindAll(this, "render", "saveItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click #contacts": "editContacts",
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideNewSelect",
            },

            hideDialog: function () {
                $(".edit-companies-dialog").remove();
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
                        Backbone.history.navigate("easyErp/Companies", { trigger: true });
                    },
                    error: function () {
                        $(".edit-companies-dialog").remove();
                        Backbone.history.navigate("easyErp/Companies", { trigger: true });
                    }
                });
            },
            showNewSelect: function (e) {
                var s = "<ul class='newSelectList'>";
                $(e.target).parent().find("select option").each(function () {
                    s += "<li>" + $(this).text() + "</li>";
                });
                s += "</ul>";
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
			    common.populateDepartments(App.ID.departmentDd, "/Departments", this.currentModel.toJSON(), function () { self.styleSelect(App.ID.departmentDd); });
			    common.populateEmployeesDd(App.ID.employeesDd, "/Employees", this.currentModel.toJSON(), function () { self.styleSelect(App.ID.employeesDd); });
			    this.styleSelect('#language');
			    this.delegateEvents(this.events);
                common.canvasDraw({ model: this.currentModel.toJSON() }, this);
                this.delegateEvents(this.events);
                return this;
            }

        });

        return EditView;
    });
