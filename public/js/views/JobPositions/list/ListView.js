define([
    'text!templates/JobPositions/list/ListHeader.html',
    'views/JobPositions/CreateView',
    'views/JobPositions/list/ListItemView',
    'collections/JobPositions/filterCollection',
    'common',
    'dataService',
    'text!templates/stages.html'
],

    function (listTemplate, createView, listItemView, contentCollection, common, dataService, stagesTamplate) {
        var JobPositionsListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            page: null, //if reload page, and in url is valid page
            contentType: 'JobPositions',//needs in view.prototype.changeLocationHash
            viewType: 'list',//needs in view.prototype.changeLocationHash
            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                 _.bind(this.collection.showMore, this.collection);
                this.defaultItemsNumber = this.collection.namberToShow || 50;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;
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
                "click  .list td:not(.notForm)": "gotoForm",
                "click #itemsButton": "itemsNumber",
                "click .currentPageList": "itemsNumber",
                "click": "hideItemsNumber",
                "click .oe_sortable": "goSort",
				"click .stageSelect": "showNewSelect",
				"click .newSelectList li": "chooseOption"

            },
	           hideNewSelect: function (e) {
	               $(".newSelectList").hide();;
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
				   var self = this;
	               var targetElement = $(e.target).parents("td");
	               var id = targetElement.attr("id").replace("stages_",'');
	               var obj = this.collection.get(id);
                   obj.urlRoot = '/JobPositions/form';
				   obj.save({ workflow: $(e.target).attr("id"),
							  expectedRecruitment:obj.toJSON().expectedRecruitment,
							  totalForecastedEmployees:obj.toJSON().totalForecastedEmployees,
							  numberOfEmployees:obj.toJSON().numberOfEmployees
							}, {
	                   headers: {
	                       mid: 39
	                   },
					   patch:true,
	                   success: function (err, model) {
	                   }
	               });

	               this.hideNewSelect();
	               return false;
	           },

	           pushStages: function(stages) {
	               this.stages = stages;
	           },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new contentCollection({
                    viewType: 'list',
                    sort: sortObject,
                    page: this.page,
                    count: this.defaultItemsNumber,
                    filter: this.filter,
                    parrentContentId: this.parrentContentId,
                    contentType: this.contentType,
                    newCollection: this.newCollection
                });
                this.collection.bind('reset', this.renderContent, this);
                this.collection.bind('showmore', this.showMoreContent, this);
            },

            renderContent: function () {
                var currentEl = this.$el;
                var tBody = currentEl.find('#listTable');
                tBody.empty();
                var itemView = new listItemView({ collection: this.collection });

                tBody.append(itemView.render());
            },


            goSort: function (e) {
                this.collection.unbind('reset');
                this.collection.unbind('showmore');
                var target$ = $(e.target);
                var currentParrentSortClass = target$.attr('class');
                var sortClass = currentParrentSortClass.split(' ')[1];
                var sortConst = 1;
                var sortBy = target$.data('sort');
                var sortObject = {};
                if (!sortClass) {
                    target$.addClass('sortDn');
                    sortClass = "sortDn";
                }
                switch (sortClass) {
                        case "sortDn":
                            {
								target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                                target$.removeClass('sortDn').addClass('sortUp');
                                sortConst = 1;
                            }
                            break;
                        case "sortUp":
                            {
								target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                                target$.removeClass('sortUp').addClass('sortDn');
                                sortConst = -1;
                            }
                            break;
                    }
                sortObject[sortBy] = sortConst;
                this.fetchSortCollection(sortObject);
                this.changeLocationHash(1, this.defaultItemsNumber);
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            },

            hideItemsNumber: function (e) {
                $(".allNumberPerPage").hide();
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            getTotalLength: function (currentNumber, itemsNumber) {
                dataService.getData('/totalCollectionLength/JobPositions', { currentNumber: currentNumber, newCollection: this.newCollection }, function (response, context) {
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

                $(document).on("click", function () {
                    self.hideItemsNumber();
                });
                common.populateWorkflowsList("Jobpositions", ".filter-check-list", ".filter-check-list", "/Workflows", null, function(stages) {
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

            previousPage: function (event) {
                event.preventDefault();
                this.prevP({
                    newCollection: this.newCollection,
                });
                dataService.getData('/totalCollectionLength/JobPositions', {
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },
            //modified for filter Vasya
            nextPage: function (event) {
                    event.preventDefault();
                    this.nextP({
                        newCollection: this.newCollection,
                    });
                    dataService.getData('/totalCollectionLength/JobPositions', {
                        newCollection: this.newCollection
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
                        newCollection: this.newCollection,
                    });
                     this.page = 1;
                    $('#check_all').prop('checked', false);
                    this.changeLocationHash(1, itemsNumber)
            },

            showPage: function (event) {
                event.preventDefault();
                this.showP(event, { newCollection: this.newCollection });
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                holder.find("#listTable").empty();
                holder.append(new listItemView({ collection: newModels }).render());
                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var id = $(e.target).closest("tr").data("id");
                window.location.hash = "#easyErp/JobPositions/form/" + id;
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
            deleteItemsRender: function (deleteCounter, deletePage) {
                dataService.getData('/totalCollectionLength/JobPositions', {
                    newCollection: this.newCollection
                },
                    function (response, context) {
                        context.listLength = response.count || 0;
                    }, this);
                this.deleteRender(deleteCounter, deletePage, {
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

        return JobPositionsListView;
    });
