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
            filter: null,
            newCollection: null,
            page: null, //if reload page, and in url is valid page
            contentType: 'Projects',//needs in view.prototype.changeLocationHash
            viewType: 'list',//needs in view.prototype.changeLocationHash

            initialize: function (options) {
                $(document).off("click");
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.parrentContentId = options.collection.parrentContentId;
                this.stages = [];
                this.filter = options.filter;
                this.defaultItemsNumber = this.collection.namberToShow || 50;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;
                this.render();
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
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
//modified for filter Vasya
            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData('/totalCollectionLength/Projects', {
                    type: 'Projects',
                    currentNumber: currentNumber,
                    filter: filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    var page = context.page || 1;
                    context.listLength = response.count || 0;
                    context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
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
						targetElement.parents("tr").attr("class","stage-"+$(e.target).text().toLowerCase().replace(' ',''));
                    }
                });

                this.hideNewSelect();
                return false;
            },
//modified for filter Vasya
            showFilteredPage: function () {
                this.startTime = new Date();
                this.newCollection = false;
                var workflowIdArray = [];
                $('.filter-check-list input:checked').each(function () {
                    workflowIdArray.push($(this).val());
                });
                this.filter = this.filter || {};
                this.filter['workflow'] = workflowIdArray;
                var itemsNumber = $("#itemsNumber").text();
                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({ count: itemsNumber, page: 1, filter: this.filter});
                this.getTotalLength(null, itemsNumber, this.filter);
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
//modified for filter Vasya
            previousPage: function (event) {
                event.preventDefault();
                this.prevP({
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/totalCollectionLength/Projects', {
                    type: 'Projects',
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },
//modified for filter Vasya
            nextPage: function (event) {
                event.preventDefault();
                this.nextP({
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/totalCollectionLength/Projects', {
                    type: 'Projects',
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },
//modified for filter Vasya
            switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;
                this.getTotalLength(null, itemsNumber, this.filter);
                this.collection.showMore({
                    count: itemsNumber,
                    page: 1,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                $('#check_all').prop('checked', false);
                this.changeLocationHash(1, itemsNumber);
            },

            showPage: function (event) {
                event.preventDefault();
                this.showP(event, { filter: this.filter, newCollection: this.newCollection });
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
                    var stage = (self.filter) ? self.filter.workflow : null;
                    if (stage) {
                        $('.filter-check-list input').each(function() {
                            var target = $(this);
                            target.attr('checked', $.inArray(target.val(), stage) > -1);
                        });
                    }
                    itemView.trigger('incomingStages', stages);
                });

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },
//modified for filter Vasya
            showMoreContent: function (newModels) {
                var holder = this.$el;
                holder.find("#listTable").empty();
                var itemView = new listItemView({ collection: newModels });
                holder.append(itemView.render());
                itemView.undelegateEvents();
                var pagenation = holder.find('.pagination');
                if (newModels.length !== 0) {
                    pagenation.show();
                } else {
                    pagenation.hide();
                }

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
//modified for filter Vasya
            deleteItemsRender: function (deleteCounter, deletePage) {
                dataService.getData('/totalCollectionLength/Projects', {
                    filter: this.filter,
                    newCollection: this.newCollection
                },
                    function (response, context) {
                        context.listLength = response.count || 0;
                    }, this);
                this.deleteRender(deleteCounter, deletePage, {
                    filter: this.filter,
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
