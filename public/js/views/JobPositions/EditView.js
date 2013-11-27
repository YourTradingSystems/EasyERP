define([
    "text!templates/JobPositions/EditTemplate.html",
    "text!templates/JobPositions/editSelectTemplate.html",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Workflows/WorkflowsCollection",
    "custom",
    'common'
],
    function (EditTemplate, editSelectTemplate, JobPositionsCollection, DepartmentsCollection, WorkflowsCollection, Custom, common) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "JobPositions",
            template: _.template(EditTemplate),

            initialize: function (options) {
                this.departmentsCollection = new DepartmentsCollection();
//                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.jobPositionsCollection = options.collection;
                this.jobPositionsCollection.bind('reset', _.bind(this.render, this));
                this.workflowsCollection = new WorkflowsCollection({ id: 'Jobposition' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
                this.collection = options.collection;
                this.currentModel = this.jobPositionsCollection.getElement();
  //              this.collection.bind('reset', _.bind(this.render, this));
                this.render = _.after(3, this.render);
            },

            events: {
                "click .breadcrumb a": "changeWorkflow",
                "change #workflowNames": "changeWorkflows"
            },

            changeWorkflows: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.collection.models[itemIndex].toJSON();
                    var name = this.$("#workflowNames option:selected").val();
                    var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                    $("#selectWorkflow").html(_.template(editSelectTemplate, { model: currentModel, workflows: this.getWorkflowValue(value) }));
                }
            },

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
            },

            /*changeWorkflow: function (e) {
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

            },*/

            saveItem: function () {
                var self = this;

                var mid = 39;

                var name = $.trim($("#name").val());

                var expectedRecruitment = $.trim($("#expectedRecruitment").val());

                var description = $.trim($("#description").val());

                var requirements = $.trim($("#requirements").val());

                var department = this.$("#department option:selected").val();
				if (department==""){
					department=null;
				}
                //var _department = common.toObject(departmentId, this.departmentsCollection);
                //var department = {};
                //if (_department) {
                //    department.id = _department._id;
                //    department.name = _department.departmentName;
                //} else {
                //    department = currentModel.defaults.department;
                //}

/*                var workflow = {
                    wName: this.$("#workflowNames option:selected").text(),
                    name: this.$("#workflow option:selected").text(),
                    status: this.$("#workflow option:selected").val(),
                };*/
                var workflow = this.$("#workflow option:selected").data("id");
                this.currentModel.set({
                    name: name,
                    expectedRecruitment: expectedRecruitment,
                    description: description,
                    requirements: requirements,
                    department: department,
                    workflow: workflow
                });

                this.currentModel.save({}, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });

            },

            render: function () {
//                var currentModel = this.jobPositionsCollection.models[itemIndex];
//              currentModel.on('change', this.render, this);
                var workflowNames = [];
                var uniqWorkflowNames = [];
                var workflowModel = this.workflowsCollection.findWhere({ name: this.currentModel.toJSON().workflow });
				var b = this.currentModel.toJSON();
				var c = this.departmentsCollection.toJSON();
				var self=this;
                this.workflowsCollection.models.forEach(function (option) {
                    if (self.currentModel.toJSON().workflow==option.get('_id')){
						workflowNames.push({"name":option.get('wName'),"id":option.get('_id')});
					}
                });

                this.workflowsCollection.models.forEach(function (option) {
                    workflowNames.push({"name":option.get('wName'),"id":option.get('_id')});
                });
				for (var i=0;i<workflowNames.length;i++){
					var b=false;
					for (var j=0;j<i;j++){
						if (workflowNames[i].name==workflowNames[j].name){
							b=true;
							break;
						}
					}
					if (!b){
						uniqWorkflowNames.push(workflowNames[i]);
					}
				}
/*                this.$el.html(_.template(EditTemplate, {
                    model: this.currentModel.toJSON(),
                    departmentsCollection: this.departmentsCollection,
                    workflowNames: uniqWorkflowNames
                }));*/
				
                var formString = this.template({
                    model: this.currentModel.toJSON(),
                    departmentsCollection: this.departmentsCollection,
                    workflowNames: uniqWorkflowNames
				
				});
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: false,
                    dialogClass: "edit-jobposition-dialog",
                    width: "70%",
                    height: 513,
                    title: "Edit Job Position",
                    buttons: [ 
						{
                            text: "Save",
                            click: function () { self.saveItem();$(this).dialog().remove(); }
                        },
						
						{
							text: "Remove",
							click: function () { $(this).dialog().remove(); }
						}
                    ],

                    //closeOnEscape: false,

                });

                $("#selectWorkflow").html(_.template(editSelectTemplate, { model: this.currentModel, workflows: this.workflowsCollection.toJSON() }));


                return this;
            }

        });

        return EditView;
    });
