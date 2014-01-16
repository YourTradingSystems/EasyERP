define([
    'text!templates/Employees/list/ListHeader.html',
    'views/Employees/CreateView',
    'views/Employees/list/ListItemView',
    'common',
    'text!templates/Alpabet/AphabeticTemplate.html'

],

    function (ListTemplate, CreateView, ListItemView, common, AphabeticTemplate) {
        var EmployeesListView = Backbone.View.extend({
            el: '#content-holder',

            initialize: function (options) {
				this.startTime = options.startTime;
                var that = this;
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.defaultItemsNumber = this.collection.namberToShow;
                this.deleteCounter = 0;
				this.allAlphabeticArray = common.buildAllAphabeticArray();
				this.selectedLetter = "All";
				this.collection.bind('reset', _.bind(this.render, this));
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
			alpabeticalRender:function(e){
                var self = this;
				$(e.target).parent().find(".current").removeClass("current");
				$(e.target).addClass("current");
				var itemsNumber = $("#itemsNumber").text();
				var page =  parseInt($("#currentShowPage").val());
				_.bind(this.collection.showMore, this.collection);
				this.selectedLetter=$(e.target).text();
				if ($(e.target).text()=="All"){
					this.selectedLetter="";
				}
                common.getListLength('Employees', this.selectedLetter, null, '/EmployeesListLength', function(response){
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
                        $("#pageList").empty();
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
				this.collection.showMore({count: itemsNumber, page: page, letter: this.selectedLetter});
			},
 			hideItemsNumber:function(e){
				$(".allNumberPerPage").hide();
			},
			itemsNumber:function(e){
				$(e.target).closest("button").next("ul").toggle();
				return false;
			},

            render: function () {
                var self = this;
                $('.ui-dialog ').remove();
                this.$el.html('');
                $('#listTableAndPagination').empty();
                this.$el.append(_.template(ListTemplate));
                this.$el.append(new ListItemView({ collection: self.collection}).render());
                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0)
                        $("#top-bar-deleteBtn").show();
                    else
                        $("#top-bar-deleteBtn").hide();
                });

                common.getListLength('Employees', null, null, '/EmployeesListLength', function(response){
                    self.listLength = response.listLength;
                    if (self.defaultItemsNumber) {
                        var itemsNumber = self.defaultItemsNumber;
                        this.defaultItemsNumber = false;
                        $("#itemsNumber").text(itemsNumber);
                    } else {
                        var itemsNumber = $("#itemsNumber").text();
                    }
                    if ((self.listLength == 0) || self.listLength == undefined) {
                        $("#grid-start").text(0);
                        $("#grid-end").text(0);
                        $("#grid-count").text(0);
                        $("#previousPage").prop("disabled",true);
                        $("#nextPage").prop("disabled",true);
                        $("#pageList").empty();
                        $("#currentShowPage").val(0);
                        $("#lastPage").text(0);
                        $("#pageList").empty();
                    } else {
                        $("#grid-start").text(1);
                        if (self.listLength <= itemsNumber) {
                            $("#grid-end").text(self.listLength - self.deleteCounter );
                        } else {
                            $("#grid-end").text(itemsNumber - self.deleteCounter);
                        }
                        $("#grid-count").text(self.listLength);
                        $("#pageList").empty();
                        var pageNumber = Math.ceil(self.listLength/itemsNumber);
                        for (var i=1;i<=pageNumber;i++) {
                            $("#pageList").append('<li class="showPage">'+ i +'</li>')
                        }
                        $("#currentShowPage").val(1);
                        $("#lastPage").text(pageNumber);
                        $("#previousPage").prop("disabled",true);
                        if (pageNumber <= 1) {
                            $("#nextPage").prop("disabled",true);
                        }
                        self.deleteCounter = 0;
                    }
                    $(document).on("click",function(){
                        self.hideItemsNumber();
                    });
                });
				common.buildAphabeticArray(this.collection,function(arr){
					$(".startLetter").remove();
					self.alphabeticArray = arr;
					self.$el.prepend(_.template(AphabeticTemplate, { alphabeticArray: self.alphabeticArray,selectedLetter: (self.selectedLetter==""?"All":self.selectedLetter),allAlphabeticArray:self.allAlphabeticArray}));
				});
				this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");

            },

            previousPage: function (event) {
                if (this.selectedLetter == 'All') {
                    var letter = null;
                } else {
                    var letter = this.selectedLetter;
                }
                event.preventDefault();
                var itemsNumber = $("#itemsNumber").text();
                var page =  parseInt($("#currentShowPage").val()) - 1;
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
                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: page, letter: letter});
            },

            nextPage: function (event) {
                if (this.selectedLetter == 'All') {
                    var letter = null;
                } else {
                    var letter = this.selectedLetter;
                }
                event.preventDefault();
                var itemsNumber = $("#itemsNumber").text();
                var page =  parseInt($("#currentShowPage").val()) + 1;
                $("#currentShowPage").val(page);
                $("#grid-start").text((page - 1)*itemsNumber+1);
                if (this.collection.listLength <= page*itemsNumber ) {
                    $("#grid-end").text(this.collection.listLength);
                    $("#nextPage").prop("disabled",true);
                } else {
                    $("#grid-end").text(page*itemsNumber);
                }
                $("#previousPage").prop("disabled",false);
                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: page, letter: letter});

            },

            switchPageCounter: function (event) {
                var self = this;
                event.preventDefault();
                if (this.selectedLetter == 'All') {
                    var letter = null;
                } else {
                    var letter = this.selectedLetter;
                }

                var itemsNumber = event.target.textContent;
                common.getListLength('Employees', letter, null, '/EmployeesListLength', function(response){
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
                        $("#pageList").empty();
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
                this.collection.showMore({count: itemsNumber, page: 1, letter: letter});
            },

            showPage: function (event) {
                event.preventDefault();
                if (this.selectedLetter == 'All') {
                    var letter = null;
                } else {
                    var letter = this.selectedLetter;
                }

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
                    this.collection.showMore({count: itemsNumber, page: page, letter: letter});
                }

            },

            showMoreContent: function (newModels) {
                $("#listTable").empty()
                new ListItemView({ collection: newModels }).render();
            },
            gotoForm: function (e) {
                App.ownContentType = true;
                var id = $(e.target).closest("tr").data("id");
                window.location.hash = "#easyErp/Employees/form/" + id;
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

        return EmployeesListView;
    });
