define([
    'text!templates/Companies/list/ListHeader.html',
    'views/Companies/CreateView',
    'views/Companies/list/ListItemView',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'common'
],

function (ListTemplate, CreateView, ListItemView, AphabeticTemplate, common) {
        var CompaniesListView = Backbone.View.extend({
            el: '#content-holder',

            initialize: function (options) {
				this.startTime = options.startTime;
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.defaultItemsNumber = this.collection.namberToShow;
                this.deleteCounter = 0;
				this.alphabeticArray = this.buildAphabeticArray(this.collection.toJSON());
				this.allAlphabeticArray = this.buildAllAphabeticArray();
				this.selectedLetter="";
                this.render();
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
				"click":"hideItemsNumber",
				"click .letter:not(.empty)": "alpabeticalRender"
            },
			buildAphabeticArray: function (collection) {
				if (collection && collection.length > 0) {
					var filtered = $.map(collection, function (item) {
						if (item.name.first[0]) {
							if ($.isNumeric(item.name.first[0].toUpperCase())) {
								return "0-9"
							}
							return item.name.first[0].toUpperCase();
						}
					});
					filtered.push("All");
					return _.sortBy(_.uniq(filtered), function (a) { return a });
				}
				return [];
			},
			buildAllAphabeticArray: function () {
				var associateArray = ["All", "0-9"]
				for (i = 65; i <= 90; i++) {
					associateArray.push(String.fromCharCode(i).toUpperCase());
				}
				return associateArray;
			},
			alpabeticalRender:function(e){
				$(e.target).parent().find(".current").removeClass("current");
				$(e.target).addClass("current");
				var itemsNumber = $("#itemsNumber").text();
				var page =  parseInt($("#currentShowPage").val());
				_.bind(this.collection.showMore, this.collection);
				this.selectedLetter=$(e.target).text();
				if ($(e.target).text()=="All"){
					this.selectedLetter="";
				}
				this.collection.showMore({count: itemsNumber, page: page, letter:this.selectedLetter});
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
                console.log('Companies render');
                $('.ui-dialog ').remove();
				this.$el.html(_.template(AphabeticTemplate, { alphabeticArray: this.alphabeticArray,selectedLetter: (this.selectedLetter==""?"All":this.selectedLetter),allAlphabeticArray:this.allAlphabeticArray}));
                this.$el.append(_.template(ListTemplate));
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

                if ((this.collection.listLength == 0) || this.collection.listLength == undefined) {
                    $("#grid-start").text(0);
                    $("#nextPage").prop("disabled",true);
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

            if ((this.collection.listLength == 0) || this.collection.listLength == undefined) {
                $("#grid-start").text(0);
                $("#nextPage").prop("disabled",true);
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
            }
            this.deleteCounter = 0;

            },
            gotoForm: function (e) {
                App.ownContentType = true;
                var id = $(e.target).closest("tr").data("id");
                window.location.hash = "#easyErp/Companies/form/" + id;
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

        return CompaniesListView;
    });
