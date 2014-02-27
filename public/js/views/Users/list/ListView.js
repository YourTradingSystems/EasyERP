/*define([
    'text!templates/Users/list/ListHeader.html',
    'views/Users/CreateView',
    'views/Users/list/ListItemView'
],

    function (ListTemplate, CreateView, ListItemView) {
        var UsersListView = Backbone.View.extend({
            el: '#content-holder',

            initialize: function (options) {
				this.startTime = options.startTime;
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.defaultItemsNumber = this.collection.namberToShow;
                this.deleteCounter = 0;
                this.render();
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
                "click  .list td:not(:has('input[type='checkbox']'))": "gotoForm",
				"click":"hideItemsNumber"
            },
			hideItemsNumber:function(e){
				$(".allNumberPerPage").hide();
			},
			itemsNumber:function(e){
				$(e.target).closest("button").next("ul").toggle();
				return false;
			},
            render: function () {
				var self=this;
                console.log('Users render');
                $('.ui-dialog ').remove();
                this.$el.html(_.template(ListTemplate));
                this.$el.append(new ListItemView({ collection: this.collection}).render());
                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0)
                        $("#top-bar-deleteBtn").show();
                    else
                        $("#top-bar-deleteBtn").hide();
                });

                $("#pageList").empty();
                if (this.defaultItemsNumber) {
                    var itemsNumber = this.defaultItemsNumber;
                    this.defaultItemsNumber = false;
                    $("#itemsNumber").text(itemsNumber);
                } else {
                    var itemsNumber = $("#itemsNumber").text();
                }
                $("#currentShowPage").val(1);
                var pageNumber = Math.ceil(this.collection.listLength/itemsNumber);
                for (var i=1;i<=pageNumber;i++) {
                    $("#pageList").append('<li class="showPage">'+ i +'</li>')
                }

                $("#lastPage").text(pageNumber);
                $("#previousPage").prop("disabled",true);
                $("#previousPage").addClass("disabled");

                if ((this.collection.listLength == 0) || this.collection.listLength == undefined) {
                    $("#grid-start").text(0);
                    $("#nextPage").prop("disabled",true);
					$("#nextPage").addClass("disabled");
                } else {
                    $("#grid-start").text(1);
                }

                if (this.collection.listLength) {
                    if (this.collection.listLength <= itemsNumber) {
                        $("#grid-end").text(this.collection.listLength - this.deleteCounter );
                    } else {
                        $("#grid-end").text(itemsNumber - this.deleteCounter);
                    }
                    $("#grid-count").text(this.collection.listLength);
                } else {
                    $("#grid-end").text(0);
                    $("#grid-count").text(0);
                }

                if (pageNumber <= 1) {
                    $("#nextPage").prop("disabled",true);
					$("#nextPage").addClass("disabled");
                }
                this.deleteCounter = 0;
				$(document).on("click",function(){
					self.hideItemsNumber();
				});
				this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");
            },

            previousPage: function (event) {
                event.preventDefault();
                var itemsNumber = $("#itemsNumber").text();
                var page = parseInt($("#currentShowPage").val()) - 1;
                $("#currentShowPage").val(page);

                if (this.collection.listLength == 0) {
                    $("#grid-start").text((page - 1)*itemsNumber);
                } else {
                    $("#grid-start").text((page - 1)*itemsNumber+1);
                }

                if (this.collection.listLength <= page*itemsNumber ) {
                    $("#grid-end").text(this.collection.listLength);
                } else {
                    $("#grid-end").text(page*itemsNumber);
                }
                $("#grid-count").text(this.collection.listLength);

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: page});
                $("#nextPage").prop("disabled",false);
                $("#nextPage").removeClass("disabled");
            },

            nextPage: function (event) {
                event.preventDefault();
                var itemsNumber = $("#itemsNumber").text();
                var page =  parseInt($("#currentShowPage").val()) + 1;
                $("#currentShowPage").val(page);

                if (this.collection.listLength == 0) {
                    $("#grid-start").text((page - 1)*itemsNumber);
                } else {
                    $("#grid-start").text((page - 1)*itemsNumber+1);
                }

                if (this.collection.listLength <= page*itemsNumber ) {
                    $("#grid-end").text(this.collection.listLength);
                } else {
                    $("#grid-end").text(page*itemsNumber);
                }
                $("#grid-count").text(this.collection.listLength);

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: page});
                $("#previousPage").prop("disabled",false);
				$("#previousPage").removeClass("disabled");
				
            },

            switchPageCounter: function (event) {
                event.preventDefault();
                $("#previousPage").prop("disabled",true);
				$("#previousPage").addClass("disabled");
                var itemsNumber = event.target.textContent;
                $("#itemsNumber").text(itemsNumber);
                $("#currentShowPage").val(1);

                if ((this.collection.listLength == 0) || this.collection.listLength == undefined) {
                    $("#grid-start").text(0);
                    $("#nextPage").prop("disabled",true);
					$("#nextPage").addClass("disabled");
                } else {
                    $("#grid-start").text(1);
                }

                if (this.collection.listLength) {
                    if (this.collection.listLength <= itemsNumber) {
                        $("#grid-end").text(this.collection.listLength);
                        $("#nextPage").prop("disabled",true);
						$("#nextPage").addClass("disabled");
                    } else {
                        $("#grid-end").text(itemsNumber);
                        $("#nextPage").prop("disabled",false);
						$("#nextPage").removeClass("disabled");
                    }
                } else {
                    $("#grid-end").text(0);
                    $("#nextPage").prop("disabled",true);
					$("#nextPage").addClass("disabled");
                }

                $("#grid-count").text(this.collection.listLength);

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: 1});
            },

            showPage: function (event) {
                event.preventDefault();
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

                $("#itemsNumber").text(itemsNumber);
                $("#currentShowPage").val(page);

                if (this.collection.listLength == 0) {
                    $("#grid-start").text((page - 1)*itemsNumber);

                } else {
                    $("#grid-start").text((page - 1)*itemsNumber+1);
                }

                if (this.collection.listLength <= page*itemsNumber ) {
                    $("#grid-end").text(this.collection.listLength);
                } else {
                    $("#grid-end").text(page*itemsNumber);
                }

                $("#grid-count").text(this.collection.listLength);

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: page});
            },

            showMoreContent: function (newModels) {
                $("#listTable").empty();
                new ListItemView({ collection: newModels }).render();
                $("#pageList").empty();
                var itemsNumber = $("#itemsNumber").text();
                var pageNumber;

                if (this.collection.listLength) {
                    pageNumber = Math.ceil(this.collection.listLength/itemsNumber);
                } else {
                    pageNumber = 0;
                }

                var currentPage = $("#currentShowPage").val();
                for (var i=currentPage;i<=pageNumber;i++) {
                    $("#pageList").append('<li class="showPage">'+ i +'</li>')
                }
                $("#lastPage").text(pageNumber);

                if (currentPage <= 1) {
                    $("#previousPage").prop("disabled",true);
					$("#previousPage").addClass("disabled");
                } else {
                    $("#previousPage").prop("disabled",false);
					$("#previousPage").removeClass("disabled");
                }

                if ((currentPage == pageNumber) || (pageNumber <= 1)) {
                    $("#nextPage").prop("disabled",true);
					$("#nextPage").addClass("disabled");
                } else {
                    $("#nextPage").prop("disabled",false);
					$("#nextPage").removeClass("disabled");
                }
            },
            gotoForm: function (e) {
                App.ownContentType = true;
                var id = $(e.target).closest("tr").data("id");
                window.location.hash = "#easyErp/Users/form/" + id;
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
                $.each($("tbody input:checked"), function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        }
                    });
                    that.collection.listLength--;
                    localCounter++
                });
                $("#grid-count").text(this.collection.listLength);
                this.defaultItemsNumber = $("#itemsNumber").text();
                this.deleteCounter = localCounter;
                this.collection.trigger('reset');
            }

        });

        return UsersListView;
    });
*/

define([
    'text!templates/Users/list/ListHeader.html',
    'views/Users/CreateView',
    'views/Users/list/ListItemView',
    'common',
    'dataService'
],

    function (listTemplate, createView, listItemView, common, dataService) {
        var UsersListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            page: null, //if reload page, and in url is valid page
            contentType: 'Users',//needs in view.prototype.changeLocationHash
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
                "click #firstShowPage": "firstPage",
                "click #lastShowPage": "lastPage",
            },

            hideItemsNumber: function (e) {
                $(".allNumberPerPage").hide();
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            getTotalLength: function (currentNumber, itemsNumber) {
                dataService.getData('/totalCollectionLength/Users', { currentNumber: currentNumber, newCollection: this.newCollection }, function (response, context) {
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
                currentEl.append(new listItemView({ collection: this.collection }).render());

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

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            previousPage: function (event) {
                event.preventDefault();
                this.prevP({
                    newCollection: this.newCollection,
                });
                dataService.getData('/totalCollectionLength/Users', {
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
                    dataService.getData('/totalCollectionLength/Users', {
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
                dataService.getData('/totalCollectionLength/Users', {
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
                dataService.getData('/totalCollectionLength/Users', {
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },  //end first last page in paginations

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
                this.showP(event);
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
                window.location.hash = "#easyErp/Users/form/" + id;
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
                dataService.getData('/totalCollectionLength/Users', {
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
                this.collectionLength = this.collection.length;
				var count = $("#listTable input:checked").length;
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
						alert(JSON.parse(res.responseText).error);
						$(checkbox).prop("checked",false);
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

        return UsersListView;
    });
