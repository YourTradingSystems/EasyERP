define([
    'text!templates/Opportunities/list/ListHeader.html',
    'views/Opportunities/CreateView',
    'views/Opportunities/list/ListItemView',
    'views/Opportunities/EditView',
    'models/OpportunitiesModel',
    'common',
    'dataService'
],

    function (listTemplate, createView, listItemView, editView, currentModel, common, dataService) {
        var OpportunitiesListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            filter: null,
            newCollection: null,
            page: null, //if reload page, and in url is valid page
            contentType: 'Opportunities',//needs in view.prototype.changeLocationHash
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
                "click .list td:not(.notForm)": "goToEditDialog",
                "click #itemsButton": "itemsNumber",
                "click .currentPageList": "itemsNumber",
                "click .filterButton": "showfilter",
                "click .filter-check-list li": "checkCheckbox",
                "click #firstShowPage": "firstPage",
                "click #lastShowPage": "lastPage",
            },

            checkCheckbox: function (e) {
                if (!$(e.target).is("input")) {
                    $(e.target).closest("li").find("input").prop("checked", !$(e.target).closest("li").find("input").prop("checked"));
                }
            },
//modified for filter Vasya
            showFilteredPage: function () {
                this.startTime = new Date();
                this.newCollection = false;
                var workflowIdArray = [];
                var isConverted = null;
                this.filter = this.filter || {};
                $('.filter-check-list input:checked').each(function () {
                    if ($(this).attr("id") == 'isConverted') {
                        isConverted = true;
                    } else {
                        workflowIdArray.push($(this).val());
                    }
                })

                this.filter['isConverted'] = isConverted;
                this.filter['workflow'] = workflowIdArray;

                var itemsNumber = $("#itemsNumber").text();
                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({ count: itemsNumber, page: 1, filter: this.filter, parrentContentId: this.parrentContentId });
                this.getTotalLength(null, itemsNumber, this.filter);
            },

            showfilter: function (e) {
                $(".filter-check-list").toggle();
                return false;
            },

            hideItemsNumber: function (e) {
                $(".allNumberPerPage").hide();
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

            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData('/totalCollectionLength/Opportunities', {
                    type: 'Leads',
                    currentNumber: currentNumber,
                    filter: filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    var page = context.page || 1;
                    context.listLength = response.count || 0;
                    context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
                }, this);
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

                common.populateWorkflowsList("Opportunities", ".filter-check-list", ".filter-check-list", "/Workflows", null, function(stages) {
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
            previousPage: function (event) {
                event.preventDefault();
                this.prevP({
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/totalCollectionLength/Opportunities', {
                    type: 'Opportunities',
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },
            //modified for filter Vasya
            nextPage: function (event) {
                event.preventDefault();
                this.nextP({
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/totalCollectionLength/Opportunities', {
                    type: 'Opportunities',
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            firstPage: function (event) {
                event.preventDefault();
                this.firstP({
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/totalCollectionLength/Opportunities', {
                    type: 'Opportunities'
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            lastPage: function (event) {
                event.preventDefault();
                this.lastP({
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/totalCollectionLength/Opportunities', {
                    type: 'Opportunities'
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },  //end first last page in paginations

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

            goToEditDialog: function (e) {
                e.preventDefault();
                var id = $(e.target).closest('tr').data("id");
                var model = new currentModel({ validate: false });
                model.urlRoot = '/Opportunities/form';
                model.fetch({
                    data: { id: id },
                    success: function (model) {
                        new editView({ model: model });
                    },
                    error: function () { alert('Please refresh browser'); }
                });
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
            //modified for filter Vasya
            deleteItemsRender: function (deleteCounter, deletePage) {
                dataService.getData('/totalCollectionLength/Opportunities', {
                    type: 'Opportunities',
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
                this.deleteRender(deleteCounter, deletePage, {
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
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
				var count = $("#listTable input:checked").length;
                this.collectionLength = this.collection.length;
                $.each($("#listTable input:checked"), function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
						wait:true,
						success:function(){
							that.listLength--;
							localCounter++;

							if (index==count-1){
								that.deleteCounter =localCounter;
								that.deletePage = $("#currentShowPage").val();
								that.deleteItemsRender(this.deleteCounter, this.deletePage);
								
							}
						},
						error: function (model, res) {
							if(res.status===403&&index===0){
								alert("You do not have permission to perform this action");
							}
							that.listLength--;
							localCounter++;
							if (index==count-1){
								that.deleteCounter =localCounter;
								that.deletePage = $("#currentShowPage").val();
								that.deleteItemsRender(this.deleteCounter, this.deletePage);
								
							}

						}
                    });
                });

            }

        });

        return OpportunitiesListView;
    });
