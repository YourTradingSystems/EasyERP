define([
    "text!templates/Projects/EditTemplate.html",
    "custom",
    "common",
    "dataService"
],
    function (EditTemplate, Custom, common, dataService) {

        var EditView = Backbone.View.extend({
            contentType: "Projects",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render");
                /* this.accountsDdCollection = new AccountsDdCollection();
                 this.customersDdCollection = new CustomersCollection();
                 this.workflowsDdCollection = new WorkflowsCollection({ id: 'project'});*/
                this.projectsCollection = options.collection;
                this.currentModel = this.projectsCollection.models[Custom.getCurrentII() - 1];
                this.render();

                /*this.accountsDdCollection.bind('reset', _.bind(this.renderView, this));
                this.customersDdCollection.bind('reset', _.bind(this.renderView, this));
                this.workflowsDdCollection.bind('reset', _.bind(this.renderView, this));*/
            },


            events: {
                "click .breadcrumb a": "changeWorkflow",
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog",
                "change #workflowDd": "changeWorkflowValues"
            },
            hideDialog: function () {
                $('.edit-project-dialog').remove();
            },

            changeWorkflow: function (e) {
                var mid = 39;
                var breadcrumb = $(e.target).closest('li');
                var a = breadcrumb.siblings().find("a");
                if (a.hasClass("active")) {
                    a.removeClass("active");
                }
                breadcrumb.find("a").addClass("active");
                var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                var ob = {
                    workflow: {
                        name: breadcrumb.data("name"),
                        status: breadcrumb.data("status")
                    }
                };

                model.set(ob);
                model.save({}, {
                    headers: {
                        mid: mid
                    }

                });

            },

            saveItem: function (event) {
                event.preventDefault();
                var self = this;

                var mid = 39;
                var projectName = $("#projectName").val();
                var projectShortDesc = $("#projectShortDesc").val();
                var idCustomer = this.$el.find("#customerDd option:selected").val();
                var _customer = common.toObject(idCustomer, self.customersDdCollection);
                var customer = {};
                if (_customer) {
                    customer.id = _customer._id;
                    customer.name = _customer.name;
                } else {
                    customer = self.currentModel.defaults.customer;
                }
                var idManager = this.$el.find("#managerDd option:selected").val();
                var _projectmanager = common.toObject(idManager, self.accountsDdCollection);
                var projectmanager = {};
                if (_projectmanager) {
                    projectmanager.id = _projectmanager._id;
                    projectmanager.imageSrc = _projectmanager.imageSrc;
                    projectmanager.name = _projectmanager.name.first + ' ' + _projectmanager.name.last;
                } else {
                    projectmanager = this.currentModel.defaults.projectmanager;
                }

                var idWorkflow = this.$el.find("#workflowDd option:selected").val();
                var workflow = common.toObject(idWorkflow, this.workflowsDdCollection);
                if (!workflow) {
                    workflow = this.currentModel.defaults.workflow;
                }

                var userNodes = this.$el.find("#usereditDd option:selected"), users = [];
                users = $.map(userNodes, function (item) {
                    return {
                        id: item.value,
                        name: item.innerHTML
                    };
                });
                /*userNodes.each(function (key, val) {
                        users.push({
                            id: val.value,
                            name: val.innerHTML
                        });
                    });*/

                self.currentModel.save({
                    projectName: projectName,
                    projectShortDesc: projectShortDesc,
                    customer: customer,
                    projectmanager: projectmanager,
                    workflow: workflow,
                    teams: {
                        users: users
                    }
                }, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function () {
                        self.$el.dialog('close');
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },
            
            changeWorkflowValues: function () {
                this.$("#workflowValue").html("");
                var that = this;
                var choosedWorkflow = _.find(that.workflows, function (workflow) {
                    return workflow._id == that.$("#workflowDd option:selected").val();
                });
                _.each(choosedWorkflow.value, function (value) {
                    this.$("#workflowValue").append("<option>" + value.name + " (" + value.status + ")" + "</option>");
                });
                this.$("#workflowValue").val(that.currentModel.toJSON().workflow.name + " (" + that.currentModel.toJSON().workflow.status + ")");

            },

            populateDropDown: function (type, selectId, url) {
                var selectList = $(selectId);
                var self = this;
                this.workflows = [];
                dataService.getData(url, { mid: 39 }, function (response) {
                    var options = $.map(response.data, function (item) {
                        switch (type) {
                            case "customer":
                                return self.customerOption(item);
                            case "person":
                                return self.personOption(item);
                            case "priority":
                                return self.priorityOption(item);
                            case "workflow":
                                self.workflows.push(item);
                                return self.workflowOption(item);
                            case "userEdit":
                                return self.userEditOption(item);

                        }
                    });
                    selectList.append(options);
                    if (typeof val != "undefined")
                        selectList.val(val).trigger("change");
                });
            },
            userEditOption: function (item) {
                return $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
            },
            workflowOption: function (item) {
                return this.currentModel.get("workflow").id === item._id ?
                    $('<option/>').val(item._id).text(item.name).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.name);
            },
            customerOption: function (item) {
                return this.currentModel.get("customer").id === item._id ?
                    $('<option/>').val(item._id).text(item.name + " (" + item.type + ")").attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.name + " (" + item.type + ")");
            },
            personOption: function (item) {
                return this.currentModel.get("projectmanager").id === item._id ?
                    $('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
            },


            render: function () {

                var formString = this.template({
                    model: this.currentModel.toJSON()
                });

                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: false,
                    title: "Edit Project",
                    dialogClass: "edit-project-dialog",
                    width: "80%",
                    height: 225
                });

                this.populateDropDown("person", App.ID.managerDd, "/getPersonsForDd");
                this.populateDropDown("customer", App.ID.customerDd, "/Customer");
                this.populateDropDown("userEdit", App.ID.userEditDd, "/getPersonsForDd");
                this.populateDropDown("workflow", App.ID.workflowDd, "/projectWorkflows");


                this.delegateEvents(this.events);

                return this;
            }

        });

        return EditView;
    });
