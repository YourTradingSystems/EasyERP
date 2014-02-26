define([
    'text!templates/JobPositions/list/ListHeader.html',
    'views/JobPositions/CreateView',
    'views/JobPositions/list/ListItemView',
    'common',
    'dataService'
],

    function (listTemplate, createView, listItemView, common, dataService) {
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
                "click": "hideItemsNumber"
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

        return JobPositionsListView;
    });
