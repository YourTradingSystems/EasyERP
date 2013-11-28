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
                this.projectsCollection = options.collection;
                this.currentModel = this.projectsCollection.getElement();
                this.render();
            },

            events: {
                "click .breadcrumb a": "changeWorkflow",
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog",
                "change #workflowDd": "changeWorkflowValues"
            },
            hideDialog: function () {
                $('.edit-project-dialog').remove();
                Backbone.history.navigate("home/content-"+this.contentType);
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
                var customer = this.$el.find("#customerDd option:selected").val();
                var projectmanager = this.$el.find("#managerDd option:selected").val();
                var workflow = this.$el.find("#workflowValue option:selected").val();

                var $userNodes = $("#usereditDd option:selected"), users = [];
                $userNodes.each(function (key, val) {
                    users.push({
                        id: val.value,
                        name: val.innerHTML
                    });
                });
                var data = {
                    projectName: projectName,
                    projectShortDesc: projectShortDesc,
                    customer: customer ? customer : null,
                    projectmanager: projectmanager ? projectmanager: null,
                    workflow: workflow ? workflow : null,
                    teams: {
                        users: users
                    }

                };

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function () {
                        $('.edit-project-dialog').remove();
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        $('.edit-project-dialog').remove();
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            changeWorkflowValues: function () {
                this.$("#workflowValue").html("");
                var that = this;
                var choosedWorkflow = _.filter(that.workflows, function (workflow) {
                    return workflow.wId == that.$("#workflowDd option:selected").val();
                });
                console.log(this.currentModel.get('workflow')._id);
                _.each(choosedWorkflow, function (value,key) {
                    this.currentModel.get('workflow')._id === value._id ?
                        this.$("#workflowValue").append( $('<option/>').val(value._id).text(value.name + " (" + value.status + ")" ).attr('selected', 'selected')):
                        this.$("#workflowValue").append( $('<option/>').val(value._id).text(value.name + " (" + value.status + ")" ));
                },this);
            },
            populateDropDown: function (type, selectId, url) {
                var selectList = $(selectId);
                var self = this;
                var workflowNames = [];
                this.workflows = [];
                selectList.append($('<option/>').text('Select...'));
                dataService.getData(url, { mid: 39 }, function (response) {
                    var options = $.map(response.data, function (item) {
                        switch (type) {
                            case "customer":
                                return self.customerOption(item);
                            case "person":
                                return self.personOption(item);
                            case "priority":
                                return self.priorityOption(item);
                            case "userEdit":
                                return self.userEditOption(item);
                            case "workflow": {
                                self.workflows.push(item);
                                if ((_.indexOf(workflowNames, item.wName)=== -1) ) {
                                    $(App.ID.workflowDd).append(self.workflowOption(item));
                                }
                                workflowNames.push(item.wName);
                            }
                            // return self.workflowOption(item);
                        }
                    });
                    selectList.append(options);
                });
            },
            userEditOption: function (item) {
                return $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
            },
            workflowOption: function (item) {
                return (this.currentModel.get("workflow") && this.currentModel.get("workflow").wId === item.wId) ?
                    $('<option/>').val(item.wId).text(item.wName).attr('selected', 'selected') :
                    $('<option/>').val(item.wId).text(item.wName);
            },
            customerOption: function (item) {
                return (this.currentModel.get("customer") && this.currentModel.get("customer")._id === item._id) ?
                    $('<option/>').val(item._id).text(item.name + " (" + item.type + ")").attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.name + " (" + item.type + ")");
            },
            personOption: function (item) {
				if (this.currentModel.get("projectmanager")){
					return this.currentModel.get("projectmanager")._id === item._id ?
						$('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected', 'selected') :
						$('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
				}
				else{
					return $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
				}
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
                var that = this;
                this.populateDropDown("person", App.ID.managerSelect, "/getPersonsForDd");
                this.populateDropDown("customer", App.ID.customerDd, "/Customer");
                this.populateDropDown("userEdit", App.ID.userEditDd, "/getPersonsForDd");
                common.populateWorkflows("Project", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON());


                this.delegateEvents(this.events);

                return this;
            }

        });

        return EditView;
    });
