define([
    "text!templates/Persons/CreateTemplate.html",
    "collections/Persons/PersonsCollection",
    "collections/Departments/DepartmentsCollection",
    "models/PersonsModel",
    "common"
],
    function (CreateTemplate, PersonsCollection, DepartmentsCollection, PersonModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Persons",
            template: _.template(CreateTemplate),
            imageSrc: '',

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new PersonModel();
                this.models = (options && options.model) ? options.model : null;
                this.page = 1;
                this.pageG = 1;
                this.render();
            },

            events: {
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                "click .prevUserList": "prevUserList",
                "click .nextUserList": "nextUserList",
				"click .details":"showDetailsBox"
            },
			showDetailsBox:function(e){
				$(e.target).parent().find(".details-box").toggle();
			},
            keydownHandler: function (e) {
                switch (e.which) {
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },

            changeTab: function (e) {
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n = $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
                $(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
                $(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
            },

            addUser: function (e) {
                var self = this;
                $(".addUserDialog").dialog({
                    dialogClass: "add-user-dialog",
                    width: "900px",
                    buttons: {
                        save: {
                            text: "Choose",
                            class: "btn",

                            click: function () {
                                click: self.addUserToTable("#targetUsers");
                                $(this).dialog("close");
                            }

                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    }

                });
                $("#targetUsers").unbind().on("click", "li", this.removeUsers);
                $("#sourceUsers").unbind().on("click", "li", this.addUsers);
                var self = this;
                $(".nextUserList").unbind().on("click", function (e) {
                    self.page += 1;
                    self.nextUserList(e, self.page);
                });
                $(".prevUserList").unbind().on("click", function (e) {
                    self.page -= 1;
                    self.prevUserList(e, self.page);
                });
            },

            addUserToTable: function (id) {
                $(".groupsAndUser").show();
                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == id.replace("#", "")) {
                        $(this).remove();
                    }
                });
                $(id).find("li").each(function () {
                    $(".groupsAndUser").append("<tr data-type='" + id.replace("#", "") + "' data-id='" + $(this).attr("id") + "'><td>" + $(this).text() + "</td><td class='text-right'></td></tr>");
                });
                if ($(".groupsAndUser tr").length < 2) {
                    $(".groupsAndUser").hide();
                }
            },

            addGroup: function (e) {
                var self = this;
                $(".addGroupDialog").dialog({
                    dialogClass: "add-group-dialog",
                    width: "900px",
                    buttons: {
                        save: {
                            text: "Choose",
                            class: "btn",
                            click: function () {
                                self.addUserToTable("#targetGroups")
                                $(this).dialog("close");
                            }
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    }

                });
                $("#targetGroups").unbind().on("click", "li", this.removeUsers);
                $("#sourceGroups").unbind().on("click", "li", this.addUsers);
                var self = this;
                $(".nextGroupList").unbind().on("click", function (e) {
                    self.pageG += 1
                    self.nextUserList(e, self.pageG)
                });
                $(".prevGroupList").unbind().on("click", function (e) {
                    self.pageG -= 1
                    self.prevUserList(e, self.pageG)
                });

            },

            unassign: function (e) {
                var id = $(e.target).closest("tr").data("id");
                var type = $(e.target).closest("tr").data("type");
                var text = $(e.target).closest("tr").find("td").eq(0).text();
                $("#" + type).append("<option value='" + id + "'>" + text + "</option>");
                $(e.target).closest("tr").remove();
                if ($(".groupsAndUser").find("tr").length == 1) {
                    $(".groupsAndUser").hide();
                }

            },

            nextUserList: function (e, page) {
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, page);
            },

            prevUserList: function (e, page) {
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, page);
            },

            addUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target));

            },

            removeUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
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

            saveItem: function () {
                var self = this;
                var mid = 39;

                var company = $('#companiesDd option:selected').val();
                var dateBirth = $(".dateBirth").val();
                var department = $("#departmentDd option:selected").val();

                var usersId = [];
                var groupsId = [];
                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                var data = {
                    name: {
                        first: $.trim(this.$el.find('#firstName').val()),
                        last: $.trim(this.$el.find('#lastName').val())
                    },
                    imageSrc: this.imageSrc,
                    dateBirth: dateBirth,
                    company: company,
                    department: department,
                    address: {
                        street: $.trim($('#addressInput').val()),
                        city: $.trim($('#cityInput').val()),
                        state: $.trim($('#stateInput').val()),
                        zip: $.trim($('#zipInput').val()),
                        country: $.trim($('#countryInput').val())
                    },
                    website: $.trim($('#websiteInput').val()),
                    jobPosition: $.trim($('#jobPositionInput').val()),
                    skype: $.trim($('#skype').val()),
                    phones: {
                        phone: $.trim($('#phoneInput').val()),
                        mobile: $.trim($('#mobileInput').val()),
                        fax: $.trim($('#faxInput').val())
                    },
                    email: $.trim($('#emailInput').val()),
                    salesPurchases: {
                        isCustomer: $('#isCustomerInput').is(':checked'),
                        isSupplier: $('#isSupplierInput').is(':checked'),
                        active: $('#isActiveInput').is('checked')
                    },
                    groups: {
                        owner: $("#allUsers").val(),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW

                };

                var model = new PersonModel();
                model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/Persons", { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        if (xhr && xhr.status === 401) {
                            Backbone.history.navigate("login", { trigger: true });
                        } else {
							alert(xhr.responseJSON.error);
                        }
                    }
                });

            },
            hideDialog: function () {
                $(".create-person-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },

            render: function () {
                var formString = this.template({
                });
                var self = this;
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "create-person-dialog",
                    title: "Edit Person",
                    width: "80%",
                    buttons: [
                        {
                            id: "create-person-dialog",
                            text: "Create",
                            click: function () { self.saveItem(); }
                        },

						{
						    text: "Cancel",
						    click: function () { $(this).dialog().remove(); }
						}]

                });
                var personModel = new PersonModel();
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, this.page);
                common.populateUsers("#allUsers", "/UsersForDd", null, null, true);
                common.populateDepartmentsList("#sourceGroups", "#targetGroups", "/DepartmentsForDd", null, this.pageG);
                common.canvasDraw({ model: personModel.toJSON() }, this);
                this.$el.find('.dateBirth').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });
                common.populateCompanies("#companiesDd", "/CompaniesForDd", this.models);
                common.populateDepartments("#departmentDd", "/DepartmentsForDd");
                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
