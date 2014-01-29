define([
    "text!templates/Tasks/CreateTemplate.html",
    "models/TasksModel",
    "common"
],
    function (CreateTemplate, TaskModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Tasks",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new TaskModel();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click #deadline": "showDatePicker",
                "change #workflowNames": "changeWorkflows",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click": "hideNewSelect",
                'keydown': 'keydownHandler'
            },
			notHide:function(e){
				return false;
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

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status, _id: value[i]._id });
                }
                return workflows;
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsDdCollection.findWhere({ name: name }).toJSON().value;
                $("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
            },

            showDatePicker: function (e) {
                if ($(".createFormDatepicker").find(".arrow").length == 0) {
                    $(".createFormDatepicker").append("<div class='arrow'></div>");
                }

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
            hideDialog: function () {
                $(".edit-dialog").remove();
            },
            saveItem: function () {
                var self = this;
                var mid = 39;
                var summary = $.trim(this.$el.find("#summary").val());
                var project = $("#projectDd option:selected").val();
                var assignedTo = $("#assignedToDd option:selected").val();
                var deadline = $.trim(this.$el.find("#deadline").val());
                var tags = $.trim(this.$el.find("#tags").val()).split(',');
                var description = $.trim(this.$el.find("#description").val());
                var sequence = $.trim(this.$el.find("#sequence").val());
                var StartDate = $.trim(this.$el.find("#StartDate").val());
                var workflow = this.$el.find("#workflowsDd option:selected").data("id");
                var estimated = $.trim(this.$el.find("#estimated").val());
                var logged = $.trim(this.$el.find("#logged").val());
                var priority = $("#priorityDd option:selected").val();
                //var priority = common.toObject(idPriority, this.priorityCollection);

                var type = this.$("#type option:selected").text();
                this.model.save({
                    type: type,
                    summary: summary,
                    assignedTo: assignedTo ? assignedTo : "",
                    workflow: workflow,
                    project: project ? project : "",
                    tags: tags,
                    deadline: deadline,
                    description: description,
                    extrainfo: {
                        priority: priority,
                        sequence: sequence,
                        StartDate: StartDate
                    },
                    estimated: estimated,
                    logged: logged,
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model, res) {
                        model = model.toJSON();
                        self.hideDialog();
                        if (!model.project) {
                            Backbone.history.navigate("#easyErp/Tasks", { trigger: true });

                        } else {
                            common.checkBackboneFragment("easyErp/Tasks/kanban/" + model.project);
                        }
                    },
                    error: function (model, xhr, options) {
                        Backbone.history.navigate("easyErp", { trigger: true });
                    }
                });
            },
			showNewSelect:function(e){
				var currentPage = 1;
				if ($(e.target).parent().find(".newSelectList").is(":visible")){
					self.hideNewSelect();
					return;
				}
				if ($(e.target).parent().find(".newSelectList").length){
					currentPage = $(e.target).parent().find(".newSelectList").data("page");
					$(e.target).parent().find(".newSelectList").remove();
				}else{
					var s="<ul class='newSelectList' data-page='"+currentPage+"'>";
					var start = (currentPage-1)*25;
					var end = Math.min(currentPage*25,$(e.target).parent().find("select option").length);
					value
					for (var i = start; i<end;i++){
						s+="<li class="+$($(e.target).parent().find("select option")[i]).text().toLowerCase()+">"+$($(e.target).parent().find("select option")[i]).text()+"</li>";						
					}
					if ($(e.target).parent().find("select option").length>25)
						s+="<li class='miniStylePagination'><a class='prev' href='javascript:;'>&lt;Prev</a><span class='counter'>"+(start+1)+"-"+end+" of "+$(e.target).parent().find("select option").length+"</span><a class='next' href='javascript:;'>Next&gt;</a></li>";
					s+="</ul>";
					$(e.target).parent().append(s);
					return false;
				}
				
			},
            hideNewSelect: function (e) {
                $(".newSelectList").hide();;
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
                var projectID = (window.location.hash).split('/')[3];
                model = projectID
                    ? {
                        project: {
                            _id: projectID
                        }
                    }
                    : null;
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 600,
                    title: "Create Task",
                    buttons: {
                        save: {
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        }
                    }
                });
                common.populateProjectsDd(App.ID.projectDd, "/getProjectsForDd", model, function () { self.styleSelect(App.ID.projectDd); });
                common.populateWorkflows("Tasks", App.ID.workflowDd, App.ID.workflowNamesDd, "/WorkflowsForDd", null, function () { self.styleSelect(App.ID.workflowDd); self.styleSelect(App.ID.workflowNamesDd); });
                common.populateEmployeesDd(App.ID.assignedToDd, "/getPersonsForDd", null, function () { self.styleSelect(App.ID.assignedToDd); });
                common.populatePriority(App.ID.priorityDd, "/Priority", model, function () { self.styleSelect(App.ID.priorityDd); });
                this.styleSelect("#type");
                $('#StartDate').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                $('#deadline').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    minDate: new Date()
                });
                //$("#ui-datepicker-div").addClass("createFormDatepicker");

                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
