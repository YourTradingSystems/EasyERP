define([
    'text!templates/Persons/list/ListHeader.html',
    'views/Persons/CreateView',
    'views/Persons/list/ListItemView',
    'text!templates/Alpabet/AphabeticTemplate.html',
	'common',
    'dataService'
],

function (ListTemplate, CreateView, ListItemView, AphabeticTemplate, common, dataService) {
    var PersonsListView = Backbone.View.extend({
        el: '#content-holder',
        defaultItemsNumber: null,
        listLength: null,
        
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.selectedLetter = "";
            this.defaultItemsNumber = this.collection.namberToShow || 50;
            this.deleteCounter = 0;
            this.render();
            this.getTotalLength();
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
            "click .letter:not(.empty)": "alpabeticalRender"
        },

        alpabeticalRender: function (e) {
            $(e.target).parent().find(".current").removeClass("current");
            $(e.target).addClass("current");
            var itemsNumber = $("#itemsNumber").text();
            var page = parseInt($("#currentShowPage").val());
            _.bind(this.collection.showMore, this.collection);
            this.selectedLetter = $(e.target).text();
            if ($(e.target).text() == "All") {
                this.selectedLetter = "";
            }
            this.collection.showMore({ count: itemsNumber, page: page, letter: this.selectedLetter });
        },

        hideItemsNumber: function (e) {
            $(".allNumberPerPage").hide();
        },

        itemsNumber: function (e) {
            $(e.target).closest("button").next("ul").toggle();
            return false;
        },

        getTotalLength: function (currentNumber) {
            dataService.getData('/totalCollectionLength/Persons', { currentNumber: currentNumber, letter: this.selectedLetter }, function (response, context) {
                context.listLength = response.count || 0;
                context.pageElementRender(response.count);//prototype in main.js
            }, this);
        },


        //switchingPagesRender: function(navigationType) {
        //    switch(navigationType)
        //},

        render: function () {
            $('.ui-dialog ').remove();
            var self = this;
            var currentEl = this.$el;

            currentEl.html('');
            currentEl.append(_.template(ListTemplate));
            currentEl.append(new ListItemView({ collection: this.collection }).render());

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

            common.buildAphabeticArray(this.collection, function (arr) {
                $("#startLetter").remove();
                self.alphabeticArray = arr;
                currentEl.prepend(_.template(AphabeticTemplate, { alphabeticArray: self.alphabeticArray, selectedLetter: (self.selectedLetter == "" ? "All" : self.selectedLetter), allAlphabeticArray: self.allAlphabeticArray }));
            });

            currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
        },

        previousPage: function (event) {
            event.preventDefault();
            
            var itemsNumber = $("#itemsNumber").text();
            var currentShowPage = $("#currentShowPage");
            var page = parseInt(currentShowPage.val()) - 1;

            this.startTime = new Date();
            
            currentShowPage.val(page);
            if (page === 1) {
                $("#previousPage").prop("disabled", true);
            }
            $("#grid-start").text((page - 1) * itemsNumber + 1);
            if (this.listLength <= page * itemsNumber) {
                $("#grid-end").text(this.listLength);
            } else {
                $("#grid-end").text(page * itemsNumber);
            }
            $("#nextPage").prop("disabled", false);

            this.collection.showMore({ count: itemsNumber, page: page, letter: this.selectedLetter });
        },

        nextPage: function (event) {
            event.preventDefault();
            var itemsNumber = $("#itemsNumber").text();
            var page = parseInt($("#currentShowPage").val()) + 1;
            $("#currentShowPage").val(page);

            if (this.collection.listLength == 0) {
                $("#grid-start").text((page - 1) * itemsNumber);
            } else {
                $("#grid-start").text((page - 1) * itemsNumber + 1);
            }

            if (this.collection.listLength <= page * itemsNumber) {
                $("#grid-end").text(this.collection.listLength);
            } else {
                $("#grid-end").text(page * itemsNumber);
            }
            $("#grid-count").text(this.collection.listLength);
            $("#previousPage").prop("disabled", false);
            $("#previousPage").removeClass("disabled");

            this.collection.showMore({ count: itemsNumber, page: page, letter: this.selectedLetter });

        },

        switchPageCounter: function (event) {
            event.preventDefault();
            $("#previousPage").prop("disabled", true);
            $("#previousPage").addClass("disabled");
            var itemsNumber = event.target.textContent;
            $("#itemsNumber").text(itemsNumber);
            $("#currentShowPage").val(1);

            if ((this.collection.listLength == 0) || this.collection.listLength == undefined) {
                $("#grid-start").text(0);
                $("#nextPage").prop("disabled", true);
            } else {
                $("#grid-start").text(1);
            }

            if (this.collection.listLength) {
                if (this.collection.listLength <= itemsNumber) {
                    $("#grid-end").text(this.collection.listLength);
                    $("#nextPage").prop("disabled", true);
                    $("#nextPage").addClass("disabled");
                } else {
                    $("#grid-end").text(itemsNumber);
                    $("#nextPage").prop("disabled", false);
                    $("#nextPage").removeClass("disabled");
                }
            } else {
                $("#grid-end").text(0);
                $("#nextPage").prop("disabled", true);
                $("#nextPage").addClass("disabled");
            }

            $("#grid-count").text(this.collection.listLength);

            this.collection.showMore({ count: itemsNumber, page: 1, letter: this.selectedLetter });
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
                $("#grid-start").text((page - 1) * itemsNumber);

            } else {
                $("#grid-start").text((page - 1) * itemsNumber + 1);
            }

            if (this.collection.listLength <= page * itemsNumber) {
                $("#grid-end").text(this.collection.listLength);
            } else {
                $("#grid-end").text(page * itemsNumber);
            }

            $("#grid-count").text(this.collection.listLength);

            this.collection.showMore({ count: itemsNumber, page: page, letter: this.selectedLetter });
        },

        showMoreContent: function (newModels) {
            var self = this;
            $("#listTable").empty();
            new ListItemView({ collection: newModels }).render();
            common.buildPagination(this.collection, function (listLength) {
                self.collection.listLength = listLength;
                $("#pageList").empty();
                var itemsNumber = $("#itemsNumber").text();
                var pageNumber;

                if (self.collection.listLength) {
                    pageNumber = Math.ceil(self.collection.listLength / itemsNumber);
                } else {
                    pageNumber = 0;
                }

                var currentPage = $("#currentShowPage").val();
                for (var i = currentPage; i <= pageNumber; i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>')
                }
                $("#lastPage").text(pageNumber);

                if (currentPage <= 1) {
                    $("#previousPage").prop("disabled", true);
                    $("#previousPage").addClass("disabled");
                } else {
                    $("#previousPage").prop("disabled", false);
                    $("#previousPage").removeClass("disabled");
                }

                if ((currentPage == pageNumber) || (pageNumber <= 1)) {
                    $("#nextPage").prop("disabled", true);
                    $("#nextPage").addClass("disabled");

                } else {
                    $("#nextPage").prop("disabled", false);
                    $("#nextPage").removeClass("disabled");

                }


                if ((self.collection.listLength == 0) || self.collection.listLength == undefined) {
                    $("#grid-start").text(0);
                    $("#nextPage").prop("disabled", true);
                }

                self.deleteCounter = 0;
            });

        },
        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).closest("tr").data("id");
            window.location.hash = "#easyErp/Persons/form/" + id;
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

    return PersonsListView;
});
