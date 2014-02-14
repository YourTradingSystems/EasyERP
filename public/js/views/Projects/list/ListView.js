define([
    'text!templates/Projects/list/ListHeader.html',
    'text!templates/stages.html',
    'views/Projects/CreateView',
    'views/Projects/list/ListItemView',
    'views/Projects/EditView',
    'models/ProjectsModel',
    'common',
    'dataService'
],

    function (listTemplate, stagesTamplate, CreateView, listItemView, editView, currentModel, common, dataService) {
        var ProjectsListView = Backbone.View.extend({
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
                "click #itemsButton": "itemsNumber",
                "click .currentPageList": "itemsNumber",
                "click": "hideItemsNumber",
                "click .filterButton": "showfilter",
                "click .filter-check-list li": "checkCheckbox",
                "click .stageSelect": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click #health .health-container": "showHealthDd",
                "click #health ul li div": "chooseHealthDd",
                "click td:not(:has('input[type='checkbox']'))": "goToEditDialog"
            },

            goToEditDialog: function (e) {
                e.preventDefault();
                var id = $(e.target).closest('tr').data("id");
                var model = new currentModel({ validate: false });
                model.urlRoot = '/Projects/form/' + id;
                model.fetch({
                    success: function (model) {
                        new editView({ model: model });
                    },
                    error: function () { alert('Please refresh browser'); }
                });
            },

            checkCheckbox: function (e) {
                if (!$(e.target).is("input")) {
                    $(e.target).closest("li").find("input").prop("checked", !$(e.target).closest("li").find("input").prop("checked"));
                }
            },

            chooseHealthDd: function (e) {
                var target = $(e.target).parents("#health");
                target.find("div a").attr("class", $(e.target).attr("class")).attr("data-value", $(e.target).attr("class").replace("health", "")).parents("#health").find("ul").toggle();
                var id = target.data("id");
                var model = this.collection.get(id);
                model.save({ health: target.find("div a").data("value") }, {
                    headers:
                        {
                            mid: 39
                        },
                    patch: true,
                    validate: false,
                    success: function () {
                        $(e.target).parents("#health").find("ul").hide();
                    }
                });
                return false;

            },

            showHealthDd: function (e) {
                $(e.target).parents("#health").find("ul").toggle();
                return false;
            },

            getTotalLength: function (currentNumber, itemsNumber) {
                dataService.getData('/totalCollectionLength/Projects', { currentNumber: currentNumber, status: this.wfStatus, newCollection: this.newCollection }, function (response, context) {
                    context.listLength = response.count || 0;
                    context.pageElementRender(response.count, itemsNumber);//prototype in main.js
                }, this);
            },

            hideNewSelect: function (e) {
                $(".newSelectList").remove();
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
                var targetElement = $(e.target).parents("td");
                var id = targetElement.attr("id");
                var model = this.collection.get(id);
                model.save({ workflow: $(e.target).attr("id") }, {
                    headers:
                        {
                            mid: 39
                        },
                    patch: true,
                    validate: false,
                    success: function () {
                        targetElement.find(".stageSelect").text($(e.target).text());
                    }
                });

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
                this.collection.showMore({ count: itemsNumber, page: 1, status: workflowIdArray });
                this.getTotalLength(null, itemsNumber);
            },

            showfilter: function (e) {
                $(".filter-check-list").toggle();
                return false;
            },

            pushStages: function (stages) {
                this.stages = stages;
            },

            hideItemsNumber: function (e) {
                $(".allNumberPerPage").hide();
                $("#health ul").hide();
                $(".newSelectList").hide();
                if (!$(e.target).closest(".filter-check-list").length) {
                    $(".allNumberPerPage").hide();
                    if ($(".filter-check-list").is(":visible")) {
                        $(".filter-check-list").hide();
                        this.showFilteredPage();
                    }
                }

            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            previousPage: function (event) {
                event.preventDefault();
                this.prevP({ status: this.wfStatus, newCollection: this.newCollection });
                dataService.getData('/totalCollectionLength/Projects', { status: this.wfStatus, newCollection: this.newCollection }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            nextPage: function (event) {
                event.preventDefault();
                this.nextP({ status: this.wfStatus, newCollection: this.newCollection });
                dataService.getData('/totalCollectionLength/Projects', { status: this.wfStatus, newCollection: this.newCollection }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;
                this.getTotalLength(null, itemsNumber);
                this.collection.showMore({ count: itemsNumber, page: 1, status: this.wfStatus, newCollection: this.newCollection });
            },

            showPage: function (event) {
                event.preventDefault();
                this.showP(event, { status: this.wfStatus, newCollection: this.newCollection });
            },

            render: function () {
                $('.ui-dialog ').remove();
                var self = this;
                var currentEl = this.$el;

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


                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });

                common.populateWorkflowsList("Projects", ".filter-check-list", ".filter-check-list", "/Workflows", null, function (stages) {
                    self.stages = stages;
                    itemView.trigger('incomingStages', stages);
                });

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
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

            gotoForm: function (e) {
                App.ownContentType = true;
                var id = $(e.target).closest("tr").data("id");
                window.location.hash = "#easyErp/Projects/form/" + id;
            },

            createItem: function () {
                //create editView in dialog here
                new CreateView();
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

            deleteItemsRender: function (deleteCounter, deletePage) {
                dataService.getData('/totalCollectionLength/Projects', {
                    status: this.wfStatus,
                    newCollection: this.newCollection
                },
                    function (response, context) {
                        context.listLength = response.count || 0;
                    }, this);
                this.deleteRender(deleteCounter, deletePage, {
                    status: this.wfStatus,
                    newCollection: this.newCollection
                });
                if (deleteCounter !== this.collectionLength) {
                    var holder = this.$el;
                    var created = holder.find('#timeRecivingDataFromServer');
                    created.before(new listItemView({ collection: this.collection }).render());
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
                    localCounter++;
                });
                this.defaultItemsNumber = $("#itemsNumber").text();
                this.deleteCounter = localCounter;
                this.deletePage = $("#currentShowPage").val();
                this.deleteItemsRender(this.deleteCounter, this.deletePage);
            }

        });

        return ProjectsListView;
    });
