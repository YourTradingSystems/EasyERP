define([
    'text!templates/Projects/list/ListHeader.html',
    'views/Projects/CreateView',
    'views/Projects/list/ListItemView',
    'common',
    'dataService'
],

    function (listTemplate, CreateView, listItemView, common, dataService) {
        var ProjectsListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            wfStatus: [],
            convertedStatus: null,
            
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
				"click":"hideItemsNumber",
				"click .filterButton":"showfilter",
				"click .filter-check-list li":"checkCheckbox",
				"click .current-selected": "showNewSelect",
				"click .newSelectList li": "chooseOption"
            },
            
			checkCheckbox:function(e){
				if(!$(e.target).is("input")){
					$(e.target).closest("li").find("input").prop("checked", !$(e.target).closest("li").find("input").prop("checked"))
				}
			},
            
			getTotalLength: function (currentNumber, itemsNumber) {
			    dataService.getData('/totalCollectionLength/Projects', { currentNumber: currentNumber, status: this.wfStatus }, function (response, context) {
			        context.listLength = response.count || 0;
			        context.pageElementRender(response.count, itemsNumber);//prototype in main.js
			    }, this);
			},

			hideNewSelect: function (e) {
			    $(".newSelectList").remove();;
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
			    var obj = this.collection.get(id);
			    obj.set({ workflow: $(e.target).attr("id"), workflowForList: true });
			    obj.save({}, {
			        headers: {
			            mid: 39
			        },
			        success: function () {
			            targetElement.find(".stageSelect").text($(e.target).text());
			        }
			    });

			    this.hideNewSelect();
			    return false;
			},

			styleSelect: function (id) {
			    $(id).parent().find(".current-selected").remove();
			    var text = $(id).find("option:selected").length == 0 ? $(id).find("option").eq(0).text() : $(id).find("option:selected").text();
			    $(id).parent().append("<a class='current-selected forList' href='javascript:;'>" + text + "</a><div class='clearfix'></div>");
			    $(id).hide();
			    $(document).on("click", this.hideNewSelect);
			},

            showFilteredPage: function () {
                var workflowIdArray = [];
                $('.filter-check-list input:checked').each(function(){
                    workflowIdArray.push($(this).val());
                })
                this.collection.status = workflowIdArray;
                var itemsNumber = $("#itemsNumber").text();
                this.collection.showMore({count: itemsNumber, page: 1, status: workflowIdArray });
            },

			showfilter:function(e){
				$(".filter-check-list").toggle();
				return false;
			},

			pushStages: function (stages) {
			    this.stages = stages;
			},
            
 			hideItemsNumber:function(e){
				$(".allNumberPerPage").hide();
				if (!$(e.target).closest(".filter-check-list").length){
					$(".allNumberPerPage").hide();
					if ($(".filter-check-list").is(":visible")){
						$(".filter-check-list").hide();
						this.showFilteredPage();
					}
				}

 			},
            
			itemsNumber:function(e){
				$(e.target).closest("button").next("ul").toggle();
				return false;
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
                    else
                    {
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
                this.defaultItemsNumber = $("#itemsNumber").text();
                this.deleteCounter = localCounter;
                this.deletePage = $("#currentShowPage").val();
                this.deleteItemsRender(this.deleteCounter, this.deletePage);
            }

        });

        return ProjectsListView;
    });
