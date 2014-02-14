define([
    'text!templates/Applications/kanban/WorkflowsTemplate.html',
    'text!templates/Applications/kanbanSettings.html',
    'collections/Workflows/WorkflowsCollection',
    'views/Applications/kanban/KanbanItemView',
    'views/Applications/EditView',
    'views/Applications/CreateView',
    'collections/Applications/ApplicationsCollection',
    'models/ApplicationsModel',
    'dataService'
],
    function (WorkflowsTemplate, kanbanSettingsTemplate, WorkflowsCollection, KanbanItemView, EditView, CreateView, ApplicationsCollection, CurrentModel, dataService) {
        var collection = new ApplicationsCollection();
        var ApplicationsKanbanView = Backbone.View.extend({
            el: '#content-holder',
            events: {
                "dblclick .item": "gotoEditForm",
                "click .item": "selectItem"
            },

            columnTotalLength: null,

            initialize: function (options) {
                this.startTime = options.startTime;
                this.workflowsCollection = options.workflowCollection;
                this.render();
                this.asyncFetc(options.workflowCollection);
                this.getCollectionLengthByWorkflows(this);
            },

			isNumberKey: function(evt){
				var charCode = (evt.which) ? evt.which : event.keyCode;
				if (charCode > 31 && (charCode < 48 || charCode > 57))
					return false;
				return true;
			},

            saveKanbanSettings: function () {
                var countPerPage = $(this).find('#cPerPage').val();
                dataService.postData('/currentUser', { 'kanbanSettings.applications.countPerPage': countPerPage }, function (seccess, error) {
                    if (seccess) {
                        $(".edit-dialog").remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate("easyErp/Applications", { trigger: true });
                    } else {
                        Backbone.history.navigate("easyErp", { trigger: true });
                    }
                });
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            editKanban: function(e){
                dataService.getData('/currentUser', null, function (user, context) {
                    var tempDom = _.template(kanbanSettingsTemplate, { applications: user.kanbanSettings.applications });
                    context.$el = $(tempDom).dialog({
                        dialogClass: "edit-dialog",
                        width: "400",
                        title: "Edit Kanban Settings",
                        buttons: {
                            save: {
                                text: "Save",
                                class: "btn",
                                click: context.saveKanbanSettings
                            },
                            cancel: {
                                text: "Cancel",
                                class: "btn",
                                click: function () {
                                    context.hideDialog();
                                }
                            }
                        }
                    });
                }, this);
            },

            getCollectionLengthByWorkflows: function (context) {
                dataService.getData('/getApplicationsLengthByWorkflows', {}, function (data) {
                    data.arrayOfObjects.forEach(function (object) {
                        var column = context.$("[data-id='" + object._id + "']");
                        column.find('.totalCount').text(object.count);
                    });
                    if (data.showMore) {
                        context.$el.append('<div id="showMoreDiv" title="To show mor ellements per column, please change kanban settings">And More</div>');
                    }
                });
            },

            selectItem: function (e) {
                $(e.target).parents(".item").parents("table").find(".active").removeClass("active");
                $(e.target).parents(".item").addClass("active");
            },

            gotoEditForm: function (e) {
                e.preventDefault();
                var id = $(e.target).closest(".inner").data("id");
                var model = new CurrentModel();
                model.urlRoot = '/Applications/form';
                model.fetch({
                    data: { id: id },
                    success: function (model, response, options) {
                        new EditView({ model: model });
                    },
                    error: function () { alert('Please refresh browser'); }
                });
            },

            asyncFetc: function (workflows) {
                _.each(workflows.toJSON(), function (wfModel) {
                    dataService.getData('/Applications/kanban', { workflowId: wfModel._id }, this.asyncRender, this);
                }, this);

            },

            asyncRender: function (response, context) {
                console.log(response.time);
                var contentCollection = new ApplicationsCollection();
                contentCollection.set(contentCollection.parse(response));
                if (collection) {
                    collection.add(contentCollection.models);
                } else {
                    collection = new ApplicationsCollection();
                    collection.set(collection.parse(response));
                }
                var kanbanItemView;
                var column = this.$("[data-id='" + response.workflowId + "']");
                column.find(".counter").html(parseInt(column.find(".counter").html()) + contentCollection.models.length);
                _.each(contentCollection.models, function (wfModel) {
                    kanbanItemView = new KanbanItemView({ model: wfModel });
                    var curEl = kanbanItemView.render().el;
                    column.append(curEl);
                }, this);

            },

            editItem: function () {
                //create editView in dialog here
                new EditView({ collection: this.collection });
            },

            createItem: function () {
                //create editView in dialog here
                new CreateView();
            },

			updateSequence:function(item, workflow, sequence, workflowStart, sequenceStart ){
				if (workflow==workflowStart){
					if (sequence>sequenceStart)
						sequence-=1;
					var a = sequenceStart;
					var b = sequence;
					var inc = -1;
					if (a>b){
						a = sequence;
						b = sequenceStart;
						inc = 1;
					}
					$(".column[data-id='"+workflow+"']").find(".item").each(function(){
						var sec = parseInt($(this).find(".inner").attr("data-sequence"));
						if (sec>=a&&sec<=b)
							$(this).find(".inner").attr("data-sequence",sec+inc);
					});
					item.find(".inner").attr("data-sequence",sequence);
					
				}else{
					$(".column[data-id='"+workflow+"']").find(".item").each(function(){
						if (parseInt($(this).find(".inner").attr("data-sequence"))>=sequence)
							$(this).find(".inner").attr("data-sequence",parseInt($(this).find(".inner").attr("data-sequence"))+1);
					});
					$(".column[data-id='"+workflowStart+"']").find(".item").each(function(){
						if (parseInt($(this).find(".inner").attr("data-sequence"))>sequenceStart)
							$(this).find(".inner").attr("data-sequence",parseInt($(this).find(".inner").attr("data-sequence"))-1);
					});
					item.find(".inner").attr("data-sequence",sequence);

				}
			},
			resize:function(){
				if ($(window).width()<$("table.kanban").width()){
					$("#mainmenu-holder").width($("table.kanban").width());
					$("#top-bar").width($("table.kanban").width());
				}
				else{
					$("#mainmenu-holder").width($(window).width());
					$("#top-bar").width($(window).width());
				}
			},
            render: function () {
				var self = this;
                var workflows = this.workflowsCollection.toJSON();
                this.$el.html(_.template(WorkflowsTemplate, { workflowsCollection: workflows }));
                $(".column").last().addClass("lastColumn");
                var itemCount;
                _.each(workflows, function (workflow, i) {
                    itemCount = 0;
                    var column = this.$(".column").eq(i);
                    //var count = " <span>(<span class='counter'>" + itemCount + "</span> / </span>";
                    var total = " <span><span class='totalCount'>" + itemCount + "</span> </span>";
                    column.find(".columnNameDiv h2").append(total);
                }, this);

                this.$(".column").sortable({
                    connectWith: ".column",
                    cancel: "h2",
                    cursor: "move",
                    items: ".item",
                    opacity: 0.7,
                    revert: true,
                    helper: 'clone',

                    start: function (event, ui) {
                        var column = ui.item.closest(".column");
                        //column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                        column.find(".totalCount").html(parseInt(column.find(".totalCount").html()) - 1);
                    },

                    stop: function (event, ui) {
                        var id = ui.item.context.id;
                        var model = collection.get(id);
                        var column = ui.item.closest(".column");
						var sequence = 0;
						if (ui.item.next().hasClass("item")){
							sequence = parseInt(ui.item.next().find(".inner").attr("data-sequence"))+1;
						}

                        if (model) {
							var secStart = parseInt($(".inner[data-id='"+model.toJSON()._id+"']").attr("data-sequence"));
							var workStart =  model.toJSON().workflow._id?model.toJSON().workflow._id:model.toJSON().workflow;
							model.save({ workflow: column.data('id'), sequenceStart:parseInt($(".inner[data-id='"+model.toJSON()._id+"']").attr("data-sequence")), sequence:sequence, workflowStart : model.toJSON().workflow._id?model.toJSON().workflow._id:model.toJSON().workflow}, {
								patch:true,
								validate: false,
								success: function (model2) {
									self.updateSequence(ui.item, column.attr("data-id"), sequence, workStart,secStart );

									collection.add(model2,{merge:true});
								}
							});
                            column.find(".counter").html(parseInt(column.find(".counter").html()) + 1);
                            column.find(".totalCount").html(parseInt(column.find(".totalCount").html()) + 1);
                        }
                    }
                }).disableSelection();
                this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
				$(document).on("keypress","#cPerPage",this.isNumberKey);

				$(window).on("resize",this.resize);
                return this;
            }
        });

        return ApplicationsKanbanView;
    });
