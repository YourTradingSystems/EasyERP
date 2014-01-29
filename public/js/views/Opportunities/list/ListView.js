define([
    'text!templates/Opportunities/list/ListHeader.html',
    'views/Opportunities/CreateView',
    'views/Opportunities/list/ListItemView',
    "common",
    'dataService'
],

    function (ListTemplate, CreateView, ListItemView, common, dataService) {
        var OpportunitiesListView = Backbone.View.extend({
            el: '#content-holder',
            wfStatus: [],
            defaultItemsNumber : 50,

            initialize: function (options) {
				this.startTime = options.startTime;
                this.collection = options.collection;
				this.stages = [];
                this.wfStatus = this.collection.status;
                //this.collection.bind('reset', _.bind(this.render, this));
                if (this.collection.namberToShow)
                    this.defaultItemsNumber = this.collection.namberToShow;
                this.render();
            },

            events: {
                "click .itemsNumber": "switchPageCounter",
                "click .showPage": "showPage",
                "change #currentShowPage": "showPage",
                "click #previousPage": "previousPage",
                "click #nextPage": "nextPage",
                "click .checkbox": "checked",
                "click  .list td:not(:has('input[type='checkbox']'))": "gotoForm",
				"click #itemsButton": "itemsNumber",
				"click .currentPageList": "itemsNumber",
				"click":"hideItemsNumber",
				"click .filterButton":"showfilter",
				"click .filter-check-list li":"checkCheckbox"


            },
			checkCheckbox:function(e){
				if(!$(e.target).is("input")){
					$(e.target).closest("li").find("input").prop("checked", !$(e.target).closest("li").find("input").prop("checked"))
				}
			},
            showFilteredPage: function (event) {
                var self = this;
                this.startTime = new Date();
                var workflowIdArray = [];
                $('.filter-check-list input:checked').each(function(){
                    workflowIdArray.push($(this).val());
                })
                this.wfStatus = workflowIdArray;
                var itemsNumber = $("#itemsNumber").text();
                dataService.getData('/OpportunitiesListLength', { mid: 39, type: 'Opportunity', status: this.wfStatus }, function (response) {
                    self.listLength = response.listLength;
                    if ((self.listLength == 0) || self.listLength == undefined) {
                        $("#grid-start").text(0);
                        $("#grid-end").text(0);
                        $("#grid-count").text(0);
                        $("#previousPage").prop("disabled",true);
                        $("#nextPage").prop("disabled",true);
                        $("#pageList").empty();
                        $("#currentShowPage").val(0);
                        $("#lastPage").text(0);
                    } else {
                        $("#grid-start").text(1);
                        if (self.listLength <= itemsNumber) {
                            $("#grid-end").text(self.listLength);
                            $("#nextPage").prop("disabled",true);
                        } else {
                            $("#grid-end").text(itemsNumber);
                            $("#nextPage").prop("disabled",false);
                        }
                        $("#grid-count").text(self.listLength);
                        $("#previousPage").prop("disabled",true);
                        $("#itemsNumber").text(itemsNumber);
                        $("#currentShowPage").val(1);
                        var pageNumber = Math.ceil(self.listLength/itemsNumber);
                        $("#lastPage").text(pageNumber);
                        $("#pageList").empty();
                        for (var i=1;i<=pageNumber;i++) {
                            $("#pageList").append('<li class="showPage">'+ i +'</li>')
                        }
                    }
                });

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: 1, status: workflowIdArray });
            },

			showfilter:function(e){
				$(".filter-check-list").toggle();
				return false;
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

            deleteItemsRender: function (deleteCounter, deletePage) {
                this.startTime = new Date();
                var self = this;
                $('.task-list').find("input").prop("checked",false);
                $("#top-bar-deleteBtn").hide();
                var itemsNumber = parseInt($("#itemsNumber").text());

                if (deleteCounter == this.collectionLength) {
                    var pageNumber = Math.ceil(this.listLength/itemsNumber);
                    if (deletePage > 1) {
                        deletePage = deletePage - 1;
                    }
                    if ((deletePage == 1) && (pageNumber > 1)) {
                        deletePage = 1
                    }
                    if (((deletePage == 1) && (pageNumber == 0)) || (deletePage == 0)) {
                        deletePage = 0
                    }

                    if (deletePage == 0) {
                        $("#grid-start").text(0);
                        $("#grid-end").text(0);
                        $("#grid-count").text(0);
                        $("#previousPage").prop("disabled",true);
                        $("#nextPage").prop("disabled",true);
                        $("#currentShowPage").val(0);
                        $("#lastPage").text(0);
                        $("#pageList").empty();
                        $("#listTable").empty();
                    } else {
                        $("#grid-start").text((deletePage-1)*itemsNumber + 1);
                        $("#grid-end").text(deletePage*itemsNumber);
                        $("#grid-count").text(this.listLength);
                        $("#currentShowPage").val(deletePage);
                        $("#pageList").empty();

                        for (var i=1;i<=pageNumber;i++) {
                            $("#pageList").append('<li class="showPage">'+ i +'</li>')
                        }
                        $("#lastPage").text(pageNumber);

                        if (deletePage <= 1 ) {
                            $("#previousPage").prop("disabled",true);
                            $("#nextPage").prop("disabled",false);
                        }
                        if (deletePage >= pageNumber) {
                            $("#nextPage").prop("disabled",true);
                            $("#previousPage").prop("disabled",false);
                        }
                        if ((1 < deletePage) && (deletePage < pageNumber)) {
                            $("#nextPage").prop("disabled",false);
                            $("#previousPage").prop("disabled",false);
                        }
                        if ((deletePage == pageNumber) && (pageNumber == 1) ) {
                            $("#previousPage").prop("disabled",true);
                            $("#nextPage").prop("disabled",true);
                        }

                        _.bind(this.collection.showMore, this.collection);
                        this.collection.showMore({count: itemsNumber, page: deletePage, status: this.wfStatus,  viewType: 'list'});
                    }
                } else {
                    $("#listTable").empty();
                    this.$el.append(new ListItemView({ collection: this.collection}).render());

                    $("#grid-start").text((deletePage-1)*itemsNumber + 1);
                    $("#grid-end").text((deletePage-1)*itemsNumber + this.collectionLength - deleteCounter);
                    $("#grid-count").text(this.listLength);
                    $("#currentShowPage").val(deletePage);

                    $("#pageList").empty();
                    var pageNumber = Math.ceil(this.listLength/itemsNumber);
                    for (var i=1;i<=pageNumber;i++) {
                        $("#pageList").append('<li class="showPage">'+ i +'</li>')
                    }
                    $("#lastPage").text(pageNumber);

                    if (deletePage <= 1 ) {
                        $("#previousPage").prop("disabled",true);
                        $("#nextPage").prop("disabled",false);
                    }
                    if (deletePage >= pageNumber) {
                        $("#nextPage").prop("disabled",true);
                        $("#previousPage").prop("disabled",false);
                    }
                    if ((1 < deletePage) && (deletePage < pageNumber)) {
                        $("#nextPage").prop("disabled",false);
                        $("#previousPage").prop("disabled",false);
                    }
                    if ((deletePage == pageNumber) && (pageNumber == 1) ) {
                        $("#previousPage").prop("disabled",true);
                        $("#nextPage").prop("disabled",true);
                    }
                    $('#timeRecivingDataFromServer').remove();
                    this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");
                }
            },

            render: function () {
                var self = this;
                $('.ui-dialog ').remove();
                this.$el.html(_.template(ListTemplate));
                var itemView = new ListItemView({ collection: this.collection });
                itemView.bind('incomingStages', itemView.pushStages, itemView);
                this.$el.append(itemView.render());
                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0)
                        $("#top-bar-deleteBtn").show();
                    else
                        $("#top-bar-deleteBtn").hide();
                });
                dataService.getData('/OpportunitiesListLength', { mid: 39, type: 'Opportunity' }, function (response) {
                    self.listLength = response.listLength;
                    var itemsNumber = self.defaultItemsNumber;
                    $("#itemsNumber").text(itemsNumber);
                    if ((self.listLength == 0) || self.listLength == undefined) {
                        $("#grid-start").text(0);
                        $("#grid-end").text(0);
                        $("#grid-count").text(0);
                        $("#previousPage").prop("disabled",true);
                        $("#nextPage").prop("disabled",true);
                        $("#pageList").empty();
                        $("#currentShowPage").val(0);
                        $("#lastPage").text(0);
                    } else {
                        $("#grid-start").text(1);
                        if (self.listLength <= itemsNumber) {
                            $("#grid-end").text(self.listLength);
                        } else {
                            $("#grid-end").text(itemsNumber);
                        }
                        $("#grid-count").text(self.listLength);
                        $("#pageList").empty();
                        var pageNumber = Math.ceil(self.listLength/itemsNumber);
                        for (var i=1;i<=pageNumber;i++) {
                            $("#pageList").append('<li class="showPage">'+ i +'</li>')
                        }
                        $("#lastPage").text(pageNumber);
                        $("#currentShowPage").val(1);
                        $("#previousPage").prop("disabled",true);
                        if (pageNumber <= 1) {
                            $("#nextPage").prop("disabled",true);
                        } else {
                            $("#nextPage").prop("disabled",false);
                        }
                    }
                });
                common.populateWorkflowsList("Opportunities", ".filter-check-list", "#workflowNamesDd", "/Workflows", null, function(stages) {
					self.stages = stages;
                    itemView.trigger('incomingStages', stages);
                });
                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });
				this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");
            },

            previousPage: function (event) {
                this.startTime = new Date();
                event.preventDefault();
                var itemsNumber = $("#itemsNumber").text();
                var page = parseInt($("#currentShowPage").val()) - 1;
                $("#currentShowPage").val(page);
                if (page == 1) {
                    $("#previousPage").prop("disabled",true);
                }
                $("#grid-start").text((page - 1)*itemsNumber+1);
                if (this.listLength <= page*itemsNumber ) {
                    $("#grid-end").text(this.listLength);
                } else {
                    $("#grid-end").text(page*itemsNumber);
                }
                $("#nextPage").prop("disabled",false);
                $('.task-list').find("input").prop("checked",false);

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: page, status: this.wfStatus, viewType: 'list'});
            },

            nextPage: function (event) {
                this.startTime = new Date();
                event.preventDefault();
                var itemsNumber = $("#itemsNumber").text();
                var page =  parseInt($("#currentShowPage").val()) + 1;
                $("#currentShowPage").val(page);
                $("#grid-start").text((page - 1)*itemsNumber+1);
                if (this.listLength <= page*itemsNumber ) {
                    $("#grid-end").text(this.listLength);
                    $("#nextPage").prop("disabled",true);
                } else {
                    $("#grid-end").text(page*itemsNumber);
                }
                $("#previousPage").prop("disabled",false);
                $('.task-list').find("input").prop("checked",false);

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: page, status: this.wfStatus, viewType: 'list'});
            },

            switchPageCounter: function (event) {
                this.startTime = new Date();
                var self = this;
                event.preventDefault();
                $('.task-list').find("input").prop("checked",false);
                var itemsNumber = event.target.textContent;

                dataService.getData('/OpportunitiesListLength', { mid: 39, type: 'Opportunity', status: this.wfStatus }, function (response) {
                    self.listLength = response.listLength;
                    if ((self.listLength == 0) || self.listLength == undefined) {
                        $("#grid-start").text(0);
                        $("#grid-end").text(0);
                        $("#grid-count").text(0);
                        $("#previousPage").prop("disabled",true);
                        $("#nextPage").prop("disabled",true);
                        $("#pageList").empty();
                        $("#currentShowPage").val(0);
                        $("#lastPage").text(0);
                    } else {
                        $("#grid-start").text(1);
                        if (self.listLength <= itemsNumber) {
                            $("#grid-end").text(self.listLength);
                            $("#nextPage").prop("disabled",true);
                        } else {
                            $("#grid-end").text(itemsNumber);
                            $("#nextPage").prop("disabled",false);
                        }
                        $("#grid-count").text(self.listLength);
                        $("#previousPage").prop("disabled",true);
                        $("#itemsNumber").text(itemsNumber);
                        $("#currentShowPage").val(1);
                        var pageNumber = Math.ceil(self.listLength/itemsNumber);
                        $("#lastPage").text(pageNumber);
                        $("#pageList").empty();
                        for (var i=1;i<=pageNumber;i++) {
                            $("#pageList").append('<li class="showPage">'+ i +'</li>')
                        }
                    }
                });

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: 1, status: this.wfStatus, viewType: 'list'});
            },

            showPage: function (event) {
                this.startTime = new Date();
                event.preventDefault();
                $('.task-list').find("input").prop("checked",false);
                if (this.listLength == 0) {
                    $("#currentShowPage").val(0);
                } else {
                    var itemsNumber = $("#itemsNumber").text();
                    var page = event.target.textContent;
                    if (!page) {
                        page = $(event.target).val();
                    }
                    var adr = /^\d+$/;
                    var lastPage = $('#lastPage').text();

                    if (!adr.test(page) || (parseInt(page) <= 0) || (parseInt(page) > parseInt(lastPage))) {
                        page = 1;
                    }
                    $("#currentShowPage").val(page);
                    $("#grid-start").text((page - 1)*itemsNumber +1);
                    if (this.listLength <= page*itemsNumber ) {
                        $("#grid-end").text(this.listLength);
                    } else {
                        $("#grid-end").text(page*itemsNumber);
                    }
                    if (page <= 1 ) {
                        $("#previousPage").prop("disabled",true);
                        $("#nextPage").prop("disabled",false);
                    }
                    if (page >= lastPage) {
                        $("#nextPage").prop("disabled",true);
                        $("#previousPage").prop("disabled",false);
                    }
                    if ((1 < page) && (page < lastPage)) {
                        $("#nextPage").prop("disabled",false);
                        $("#previousPage").prop("disabled",false);
                    }
                    if ((page == lastPage) && (lastPage == 1) ) {
                        $("#previousPage").prop("disabled",true);
                        $("#nextPage").prop("disabled",true);
                    }

                    _.bind(this.collection.showMore, this.collection);
                    this.collection.showMore({count: itemsNumber, page: page, status: this.wfStatus, viewType: 'list'});
                }
            },

            showMoreContent: function (newModels) {
                $("#listTable").empty();
                this.$el.append(new ListItemView({ collection: newModels }).render());
                $('#timeRecivingDataFromServer').remove();
                this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");
            },
            gotoForm: function (e) {
                App.ownContentType = true;
                var id = $(e.target).closest("tr").data("id");
                window.location.hash = "#easyErp/Opportunities/form/" + id;
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
                this.deleteCounter = localCounter;
                this.deletePage = $("#currentShowPage").val();
                this.deleteItemsRender(this.deleteCounter, this.deletePage);
            }

    });

        return OpportunitiesListView;
    });
