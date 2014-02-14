define([
    'text!templates/Tasks/list/ListHeader.html',
    'text!templates/stages.html',
    'views/Tasks/CreateView',
    'views/Tasks/list/ListItemView',
    'views/Tasks/EditView',
    'models/TasksModel',
    'views/Projects/EditView',
    'models/ProjectsModel',
	'common',
    'dataService'
],

    function (listTemplate, stagesTamplate, createView, listItemView, editView, currentModel, projectEditView, projectModel, common, dataService) {
        var TasksListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            wfStatus: [],
            convertedStatus: null,
            newCollection: true,

            initialize: function (options) {
                $(document).off("click");
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.parrentContentId = options.collection.parrentContentId;
                this.stages = [];
                this.wfStatus = this.collection.wfStatus;
                this.defaultItemsNumber = this.collection.namberToShow || 50;
                this.deleteCounter = 0;
                this.render();
                this.getTotalLength(null, this.defaultItemsNumber);
            },

            events: {
                "click .itemsNumber": "switchPageCounter",
                "click .showPage": "showPage",
                "change #currentShowPage": "showPage",
                "click #previousPage": "previousPage",
                "click #nextPage": "nextPage",
                "click .checkbox": "checked",
                "click td:not(:has('input[type='checkbox']'))": "goToEditDialog",
                "click .project": "goToProject",
                "click #itemsButton": "itemsNumber",
                "click .currentPageList": "itemsNumber",
                "click": "hideItemsNumber",
                "click .stageSelect": "showNewSelect",
                "click .stageSelectType": "showNewSelectType",
                "click .newSelectList li": "chooseOption",
                "click .filterButton": "showfilter",
                "click .filter-check-list li": "checkCheckbox"
            },

            getTotalLength: function (currentNumber, itemsNumber) {
                dataService.getData('/totalCollectionLength/Tasks', {
                    type: 'Tasks',
                    currentNumber: currentNumber,
                    status: this.wfStatus,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                    context.pageElementRender(response.count, itemsNumber);//prototype in main.js
                }, this);
            },

            goToProject: function (e) {
                var projectId = $(e.target).data('id');
                var model = new projectModel({ validate: false });
                model.urlRoot = '/Projects/form/' + projectId;
                model.fetch({
                    success: function (model) {
                        new projectEditView({ model: model });
                    },
                    error: function () { alert('Please refresh browser'); }
                });
                return false;
            },

            goToEditDialog: function (e) {
                e.preventDefault();
                var id = $(e.target).closest('tr').data("id");
                var model = new currentModel({ validate: false });
                model.urlRoot = '/Tasks/form';
                model.fetch({
                    data: { id: id },
                    success: function (model) {
                        new editView({ model: model });
                    },
                    error: function () { alert('Please refresh browser'); }
                });
            },

            hideNewSelect: function (e) {
                $(".newSelectList").hide();
            },

            showfilter: function (e) {
                $(".filter-check-list").toggle();
                return false;
            },

            checkCheckbox: function (e) {
                if (!$(e.target).is("input")) {
                    $(e.target).closest("li").find("input").prop("checked", !$(e.target).closest("li").find("input").prop("checked"));
                }
            },

            showNewSelectType: function (e) {
                if ($(".newSelectList").is(":visible")) {
                    this.hideNewSelect();
                    return false;
                } else {
                    var targetElement = $(e.target).parents("td");
                    targetElement.find(".newSelectList").show();
                    return false;
                }
            },

            showNewSelect: function (e) {
                if ($(".newSelectList").is(":visible")) {
                    this.hideNewSelect();
                    return false;
                } else {
                    $(e.target).parent().append(_.template(stagesTamplate, { stagesCollection: this.stages }));
                    return false;
                }
            },

            chooseOption: function (e) {
                var that = this;
                var target = $(e.target);
                var targetParrentElement = target.parents("td");
                var selectType = targetParrentElement.attr("id").split("_")[0];
                var model;
                var id;
                if (selectType == 'stages') {
                    id = targetParrentElement.attr("id").replace("stages_", "");
                    model = this.collection.get(id);
                    model.urlRoot = '/Tasks/form/';
                    model.save({
                        workflow: target.attr("id"),
                        sequence: -1,
                        sequenceStart: model.toJSON().sequence,
                        workflowStart: model.toJSON().workflow._id
                    },
                    {
                        headers:
                            {
                                mid: 39
                            },
                        patch: true,
                        validate: false,
                        success: function () {
                            that.showFilteredPage();
                        }
                    });
                } else if (selectType == 'type') {
                    id = targetParrentElement.attr("id").replace("type_", "");
                    model = this.collection.get(id);
                    model.urlRoot = '/Tasks/form/';
                    var type = target.attr("id");
                    model.save({
                        type: type,
                    },
                    {
                        headers:
                            {
                                mid: 39
                            },
                        patch: true,
                        validate: false,
                        success: function (model) {
                            //that.showFilteredPage();//When add filter by Type, then uncoment this code
                            targetParrentElement.find('#' + model.id).text(type);
                        }
                    });
                }
                this.hideNewSelect();
                return false;
            },

            showFilteredPage: function () {
                this.startTime = new Date();
                var workflowIdArray = [];
                $('.filter-check-list input:checked').each(function () {
                    workflowIdArray.push($(this).val());
                });
                this.wfStatus = workflowIdArray;
                var itemsNumber = $("#itemsNumber").text();
                this.collection.showMore({ count: itemsNumber, page: 1, status: workflowIdArray, parrentContentId: this.parrentContentId });
                this.getTotalLength(null, itemsNumber);
            },

            hideItemsNumber: function (e) {
                $(".allNumberPerPage").hide();
                $(".newSelectList").hide();
                if (!$(e.target).closest(".filter-check-list").length) {
                    $(".allNumberPerPage").hide();
                    if ($(".filter-check-list").is(":visible")) {
                        $(".filter-check-list").hide();
                        this.showFilteredPage();
                    }
                }
            },

            pushStages: function (stages) {
                this.stages = stages;
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            deleteItemsRender: function (deleteCounter, deletePage) {
                dataService.getData('/totalCollectionLength/Tasks', {
                    type: 'Tasks',
                    status: this.wfStatus,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
                this.deleteRender(deleteCounter, deletePage, {
                    status: this.wfStatus,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                if (deleteCounter !== this.collectionLength) {
                    var holder = this.$el;
                    var created = holder.find('#timeRecivingDataFromServer');
                    created.before(new listItemView({ collection: this.collection }).render());
                }
            },

            render: function () {
                $('.ui-dialog ').remove();
                var self = this;
                var currentEl = this.$el;

                currentEl.html('');
                currentEl.append(_.template(listTemplate));

                currentEl.html('');
                currentEl.append(_.template(listTemplate));
                var itemView = new listItemView({ collection: this.collection });
                currentEl.append(itemView.render());

                itemView.bind('incomingStages', itemView.pushStages, itemView);

                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0)
                        $("#top-bar-deleteBtn").show();
                    else
                        $("#top-bar-deleteBtn").hide();
                });

                common.populateWorkflowsList("Tasks", ".filter-check-list", "#workflowNamesDd", "/Workflows", null, function (stages) {
                    self.stages = stages;
                    itemView.trigger('incomingStages', stages);
                });

                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            previousPage: function (event) {
                event.preventDefault();
                this.prevP({
                    status: this.wfStatus,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/totalCollectionLength/Tasks', {
                    type: 'Tasks',
                    status: this.wfStatus,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            nextPage: function (event) {
                event.preventDefault();
                this.nextP({
                    status: this.wfStatus,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/totalCollectionLength/Projects', {
                    type: 'Tasks',
                    status: this.wfStatus,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;
                this.getTotalLength(null, itemsNumber);
                this.collection.showMore({
                    count: itemsNumber,
                    page: 1,
                    status: this.wfStatus,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
            },

            showPage: function (event) {
                event.preventDefault();
                this.showP(event, { status: this.wfStatus, newCollection: this.newCollection, parrentContentId: this.parrentContentId });
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                holder.find("#listTable").empty();
                var itemView = new listItemView({ collection: newModels });
                holder.append(itemView.render());
                itemView.undelegateEvents();

                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            createItem: function () {
                //create editView in dialog here
                new createView();
            },

            checked: function () {
                if (this.collection.length > 0) {
                    if ($("input.checkbox:checked").length > 0)
                        $("#top-bar-deleteBtn").show();
                    else {
                        $("#top-bar-deleteBtn").hide();
                        $('#check_all').prop('checked', false);
                    }
                }
            },

            deleteItems: function () {
                var that = this,
                    mid = 39,
                    model;
                var localCounter = 0;
                this.collectionLength = this.collection.length;
                $.each($("tbody input:checked"), function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        }
                    });
                    that.listLength--;
                    localCounter++
                });
                this.deleteCounter = localCounter;
                this.deletePage = $("#currentShowPage").val();
                this.deleteItemsRender(this.deleteCounter, this.deletePage);
            }

        });

        return TasksListView;
    });
