define([
    "text!templates/Projects/EditTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "custom",
    "common"
],
    function (EditTemplate, AccountsDdCollection, CustomersCollection, WorkflowsCollection, Custom, common) {

        var EditView = Backbone.View.extend({
            contentType: "Projects",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render");
                this.accountsDdCollection = new AccountsDdCollection();
                this.customersDdCollection = new CustomersCollection();
                this.workflowsDdCollection = new WorkflowsCollection({ id: 'project'});
                this.projectsCollection = options.collection;
                this.currentModel = this.projectsCollection.models[Custom.getCurrentII()-1];
                this.renderView = _.after(3, this.render);
                this.accountsDdCollection.bind('reset', _.bind(this.renderView, this));
                this.customersDdCollection.bind('reset', _.bind(this.renderView, this));
                this.workflowsDdCollection.bind('reset', _.bind(this.renderView, this));
            },

            renderView:function(){
                console.log('RENDERVIEW');
            },

            events: {
                "click .breadcrumb a": "changeWorkflow",
                "click #saveBtn" : "saveItem",
                "click #cancelBtn" : "hideDialog"
            },
            hideDialog: function(){
                this.$el.dialog('close');
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

                var $userNodes = this.$el.find("#usereditDd option:selected"), users = [];
                $userNodes.each(function (key, val) {
                    users.push({
                        id: val.value,
                        name: val.innerHTML
                    });
                });

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

            render: function () {
                console.log("REnder Projects Edit View");
                var formString = this.template({
                    model: this.currentModel.toJSON(),
                    accountsDdCollection: this.accountsDdCollection.toJSON(),
                    customersDdCollection: this.customersDdCollection.toJSON(),
                    workflowsDdCollection: this.workflowsDdCollection.toJSON() });

                this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:true,
                    title: "Edit Project"
                });
                this.delegateEvents(this.events);


                /*var workflows = this.workflowsDdCollection.models;

                _.each(workflows, function (workflow, index) {
                    $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                });

                _.each(workflows, function (workflow, i) {
                    var breadcrumb = this.$(".breadcrumb li").eq(i);
                    if (this.currentModel.get("workflow").name === breadcrumb.data("name")) {
                        breadcrumb.find("a").addClass("active");
                    }
                }, this);*/

                return this;
            }

        });

        return EditView;
    });