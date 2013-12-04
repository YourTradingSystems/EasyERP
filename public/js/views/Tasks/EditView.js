define([
    "text!templates/Tasks/EditTemplate.html",
    "common",
    "custom",
    "dataService",
    "collections/Projects/ProjectsCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Customers/CustomersCollection",
    "collections/Priority/TaskPriority",
    "collections/Workflows/WorkflowsCollection"
],
    function (EditTemplate, common, Custom, dataService, ProjectsCollection, AccountsDdCollection, CustomersDdCollection, PriorityCollection, WorkflowsCollection) {

        var EditView = Backbone.View.extend({
            contentType: "Tasks",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #Cancel span, #Done span": "changeWorkflow",
                "change #workflowDd": "changeWorkflowValues",
                'keydown': 'keydownHandler',
                "click .current-selected": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideNewSelect"
            },
            keydownHandler: function(e){
                switch (e.which){
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            changeWorkflow: function (e) {
                var mid = 39;
                var model = {};
                var name = '', status = '';
                if ($(e.target).hasClass("applicationWorkflowLabel")) {
                    var breadcrumb = $(e.target).closest('li');
                    var a = breadcrumb.siblings().find("a");
                    if (a.hasClass("active")) {
                        a.removeClass("active");
                    }
                    breadcrumb.find("a").addClass("active");
                    name = breadcrumb.data("name");
                    status = breadcrumb.data("status");
                } else {
                    var workflow = {};
                    var length = this.workflowsDdCollection.models.length;
                    if ($(e.target).closest("button").attr("id") == "Cancel") {
                        workflow = this.workflowsDdCollection.models[length - 1];
                    }
                    else {
                        workflow = this.workflowsDdCollection.models[length - 2];
                    }
                    name = workflow.get('name');
                    status = workflow.get('status');
                }
                model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                var ob = {
                    workflow: {
                        name: name,
                        status: status
                    }
                };

                model.set(ob);
                model.save({}, {
                    headers: {
                        mid: mid
                    }

                });

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

            saveItem: function (event) {
                event.preventDefault();
                var self = this;

                var mid = 39;

                var project = $("#projectDd option:selected").val();
                var assignedTo = $("#assignedToDd option:selected").val();

                var tags = $.trim($("#tags").val()).split(',');
                if (tags.length == 0) {
                    tags = null;
                }

                var sequence = parseInt($.trim($("#sequence").val()));
                if (!sequence) {
                    sequence = null;
                }

                var customer = $("#customerDd option:selected").val();
                var workflow = $("#workflowsDd option:selected").val();


                var estimated = $("#estimated").val();
                if ($.trim(estimated) == "") {
                    estimated = 0;
                }

                var logged = $("#logged").val();
                if ($.trim(logged) == "") {
                    logged = 0;
                }

                var priority = $("#priorityDd option:selected").val();

                var data = {
                    type: $("#type option:selected").text(),
                    summary: $("#summary").val(),
                    assignedTo: assignedTo ? assignedTo : null,
                    workflow: workflow ? workflow : null,
                    project: project ? project : null,
                    tags: tags,
                    deadline: $.trim($("#deadline").val()),
                    description: $("#description").val(),
                    extrainfo: {
                        //priority: priority ? priority,
                        sequence: sequence,
                        StartDate: $.trim($("#StartDate").val()),
                        EndDate: $.trim($("#EndDate").val())
                    },
                    estimated: estimated,
                    logged: logged
                };


                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
						self.hideDialog();
                        if (project == '0' || !project) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        } else {
                            Backbone.history.navigate("home/content-Tasks/kanban/" + project, { trigger: true });
                        }
                    },
                    error: function () {
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
			showNewSelect:function(e){
				var s="<ul class='newSelectList'>";
				$(e.target).parent().find("select option").each(function(){
					s+="<li>"+$(this).text()+"</li>";
				});
				 s+="</ul>";
				$(e.target).parent().append(s);
				
			},
			hideNewSelect:function(e){
				$(".newSelectList").remove();;
			},
			showNewSelect:function(e){
				this.hideNewSelect();
				var s="<ul class='newSelectList'>";
				$(e.target).parent().find("select option").each(function(){
					s+="<li class="+$(this).text().toLowerCase()+">"+$(this).text()+"</li>";
				});
				 s+="</ul>";
				$(e.target).parent().append(s);
				return false;
				
			},
			chooseOption:function(e){
				var k = $(e.target).parent().find("li").index($(e.target));
				$(e.target).parents("dd").find("select option:selected").removeAttr("selected");
				$(e.target).parents("dd").find("select option").eq(k).attr("selected","selected");
				$(e.target).parents("dd").find(".current-selected").text($(e.target).text());
			},

			styleSelect:function(id){
				var text = $(id).find("option:selected").length==0?$(id).find("option").eq(0).text():$(id).find("option:selected").text();
				$(id).parent().append("<a class='current-selected' href='javascript:;'>"+text+"</a>");
				$(id).hide();
			},
            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 600,
                    title: this.currentModel.toJSON().project.projectShortDesc,
                    buttons:{
                        save:{
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel:{
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        }
                    }
                });

                $('#StartDate').datepicker({ dateFormat: "d M, yy" });
                $('#EndDate').datepicker({ dateFormat: "d M, yy" });
                $('#deadline').datepicker({ dateFormat: "d M, yy" });
                common.populateProjectsDd(App.ID.projectDd, "/getProjectsForDd", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.projectDd);});
                common.populateWorkflows("Task", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.workflowDd);self.styleSelect(App.ID.workflowNamesDd);});
                common.populateEmployeesDd(App.ID.assignedToDd, "/getPersonsForDd", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.assignedToDd);});
                common.populatePriority(App.ID.priorityDd, "/Priority", this.currentModel.toJSON(), function(){self.styleSelect(App.ID.priorityDd);});
				this.styleSelect("#type");
                this.delegateEvents(this.events);
                $('#deadline').datepicker({ dateFormat: "d M, yy", showOtherMonths: true, selectOtherMonths: true });
                $("#ui-datepicker-div").addClass("createFormDatepicker");
                return this;
            }

        });
        return EditView;
    });
