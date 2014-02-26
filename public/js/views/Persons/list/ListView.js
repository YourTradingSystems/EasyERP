define([
    'text!templates/Persons/list/ListHeader.html',
    'views/Persons/CreateView',
    'views/Persons/list/ListItemView',
    'text!templates/Alpabet/AphabeticTemplate.html',
	'common',
    'dataService'
],

function (listTemplate, createView, listItemView, aphabeticTemplate, common, dataService) {
    var PersonsListView = Backbone.View.extend({
        el: '#content-holder',
        defaultItemsNumber: null,
        listLength: null,
        filter: null,
        newCollection: null,
        page: null, //if reload page, and in url is valid page
        contentType: 'Persons',//needs in view.prototype.changeLocationHash
        viewType: 'list',//needs in view.prototype.changeLocationHash
        
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            _.bind(this.collection.showMore, this.collection);
            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray();
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
            "click  .list td:not(.notForm)": "gotoForm",
            "click #itemsButton": "itemsNumber",
            "click .currentPageList": "itemsNumber",
            "click": "hideItemsNumber",
            "click .letter:not(.empty)": "alpabeticalRender",
            "click #firstShowPage": "firstPage",
            "click #lastShowPage": "lastPage",
        },

        alpabeticalRender: function (e) {
                this.startTime = new Date();
                $(e.target).parent().find(".current").removeClass("current");
                $(e.target).addClass("current");

                var selectedLetter = $(e.target).text();
                if ($(e.target).text() == "All") {
                    selectedLetter = "";
                }
                this.filter = this.filter || {};
                this.filter['letter'] = selectedLetter;
                var itemsNumber = $("#itemsNumber").text();
                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({ count: itemsNumber, page: 1, filter: this.filter});
                this.getTotalLength(null, itemsNumber, this.filter);
        },

        hideItemsNumber: function (e) {
            $(".allNumberPerPage").hide();
        },

        itemsNumber: function (e) {
            $(e.target).closest("button").next("ul").toggle();
            return false;
        },

        getTotalLength: function (currentNumber, itemsNumber,filter) {
                dataService.getData('/totalCollectionLength/Persons', {
                    currentNumber: currentNumber,
                    filter: filter,
                    newCollection: this.newCollection,
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

            common.buildAphabeticArray(this.collection, function (arr) {
                $("#startLetter").remove();
                self.alphabeticArray = arr;
                currentEl.prepend(_.template(aphabeticTemplate, { alphabeticArray: self.alphabeticArray, selectedLetter: (self.selectedLetter == "" ? "All" : self.selectedLetter), allAlphabeticArray: self.allAlphabeticArray }));
                 var currentLetter = (self.filter) ? self.filter.letter : null
                    if (currentLetter) {
                        $('#startLetter a').each(function() {
                            var target = $(this);
                            if (target.text() == currentLetter) {
                                target.addClass("current");
                            }
                        });
                    }
            });

            currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
        },

        previousPage: function (event) {
                event.preventDefault();
                this.prevP({
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/totalCollectionLength/Persons', {
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

        nextPage: function (event) {
                event.preventDefault();
                this.nextP({
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/totalCollectionLength/Persons', {
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
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
                dataService.getData('/totalCollectionLength/Persons', {
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
                dataService.getData('/totalCollectionLength/Persons', {
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
                this.getTotalLength(null, itemsNumber, this.filter);
                this.collection.showMore({
                    count: itemsNumber,
                    page: 1,
                    filter: this.filter,
                    newCollection: this.newCollection,
                });
                $('#check_all').prop('checked', false);
                this.changeLocationHash(1, itemsNumber,this.filter);
        },

        showFilteredPage: function (e) {
                this.startTime = new Date();
                this.newCollection = false;

                var selectedLetter = $(e.target).text();
                if ($(e.target).text() == "All") {
                    selectedLetter = '';
                }
                this.filter = this.filter || {};
                this.filter['letter'] = selectedLetter;
                var itemsNumber = $("#itemsNumber").text();
                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({ count: itemsNumber, page: 1, filter: this.filter});
                this.getTotalLength(null, itemsNumber, this.filter);
            },
        showPage: function (event) {
                event.preventDefault();
                this.showP(event,{filter: this.filter, newCollection: this.newCollection});
        },

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

        showMoreAlphabet: function (newModels) {
            var holder = this.$el;
            var alphaBet = holder.find('#startLetter');
            var created = holder.find('#timeRecivingDataFromServer');
            var countPerPage = this.countPerPage = newModels.length;

            content.remove();

            holder.append(this.template({ collection: newModels.toJSON() }));

            this.getTotalLength(null, itemsNumber, this.filter);
            created.text("Created in " + (new Date() - this.startTime) + " ms");
            holder.prepend(alphaBet);
            holder.append(created);
            this.asyncLoadImgs(newModels);
        },

        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).closest("tr").data("id");
            window.location.hash = "#easyErp/Persons/form/" + id;
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
                dataService.getData('/totalCollectionLength/Persons', {
                    filter: this.filter,
                    newCollection: this.newCollection,
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
            this.collectionLength = this.collection.length;
            $.each($("#listTable input:checked"), function (index, checkbox) {
                model = that.collection.get(checkbox.value);
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
                that.listLength--;
                localCounter++;
            });
            this.deleteCounter = localCounter;
            this.deletePage = $("#currentShowPage").val();
            this.deleteItemsRender(this.deleteCounter, this.deletePage);
        }

    });

    return PersonsListView;
});