define([
    'text!templates/Companies/list/ListHeader.html',
    'views/Companies/CreateView',
    'views/Companies/list/ListItemView',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'common',
    'dataService'
],

function (listTemplate, createView, listItemView, aphabeticTemplate, common, dataService) {
    var CompaniesListView = Backbone.View.extend({
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
            "click .letter:not(.empty)": "alpabeticalRender"
        },

        alpabeticalRender: function (e) {
            this.startTime = new Date();
            $(e.target).parent().find(".current").removeClass("current");
            $(e.target).addClass("current");
            var itemsNumber = $("#itemsNumber").text();
            var page = parseInt($("#currentShowPage").val());
            this.selectedLetter = $(e.target).text();
            if ($(e.target).text() == "All") {
                this.selectedLetter = "";
            }
            this.collection.showMore({ count: itemsNumber, page: page, letter: this.selectedLetter });
            this.getTotalLength(null, itemsNumber);
        },

        hideItemsNumber: function (e) {
            $(".allNumberPerPage").hide();
        },

        itemsNumber: function (e) {
            $(e.target).closest("button").next("ul").toggle();
            return false;
        },

        getTotalLength: function (currentNumber, itemsNumber) {
            dataService.getData('/totalCollectionLength/Companies', { currentNumber: currentNumber, letter: this.selectedLetter }, function (response, context) {
                context.listLength = response.count || 0;
                context.pageElementRender(response.count, itemsNumber);//prototype in main.js
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
            });

            currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
        },

        previousPage: function (event) {
            event.preventDefault();
            this.prevP();
            dataService.getData('/totalCollectionLength/Companies', null, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        nextPage: function (event) {
            event.preventDefault();
            this.nextP();
            dataService.getData('/totalCollectionLength/Companies', null, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        switchPageCounter: function (event) {
            event.preventDefault();
            this.startTime = new Date();
            var itemsNumber = event.target.textContent;
            this.getTotalLength(null, itemsNumber);

            this.collection.showMore({ count: itemsNumber, page: 1, letter: this.selectedLetter });
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
            window.location.hash = "#easyErp/Companies/form/" + id;
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
            this.deleteRender(deleteCounter, deletePage);
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

    return CompaniesListView;
});
