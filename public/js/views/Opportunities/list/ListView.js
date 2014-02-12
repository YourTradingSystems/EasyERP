define([
    'text!templates/Opportunities/list/ListHeader.html',
    'views/Opportunities/CreateView',
    'views/Opportunities/list/ListItemView',
    'common',
    'dataService'
],

    function (listTemplate, createView, listItemView, common, dataService) {
        var OpportunitiesListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            wfStatus: [],
            convertedStatus: null,

            initialize: function (options) {
                $(document).off("click");
                this.startTime = options.startTime;
                this.collection = options.collection;
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
                "click .list td:not(.notForm)": "gotoForm",
                "click #itemsButton": "itemsNumber",
                "click .currentPageList": "itemsNumber",
                "click .filterButton": "showfilter",
                "click .filter-check-list li": "checkCheckbox"
            },

            checkCheckbox: function (e) {
                if (!$(e.target).is("input")) {
                    $(e.target).closest("li").find("input").prop("checked", !$(e.target).closest("li").find("input").prop("checked"))
                }
            },

            showFilteredPage: function () {
                this.startTime = new Date();

                var workflowIdArray = [];
                var isConverted = null;
                $('.filter-check-list input:checked').each(function () {
                    if ($(this).attr("id") == 'isConverted') {
                        isConverted = true;
                    } else {
                        workflowIdArray.push($(this).val());
                    }
                });
                this.convertedStatus = isConverted;
                this.wfStatus = workflowIdArray;

                var itemsNumber = $("#itemsNumber").text();
                this.collection.showMore({ count: itemsNumber, page: 1, status: workflowIdArray, isConverted: isConverted });
                this.getTotalLength(null, itemsNumber);
            },

            showfilter: function (e) {
                $(".filter-check-list").toggle();
                return false;
            },

            hideItemsNumber: function (e) {
                $(".allNumberPerPage").hide();
                if (!$(e.target).closest(".filter-check-list").length) {
                    $(".allNumberPerPage").hide();
                    if ($(".filter-check-list").is(":visible")) {
                        $(".filter-check-list").hide();
                        this.showFilteredPage();
                    }
                }
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            getTotalLength: function (currentNumber, itemsNumber) {
                dataService.getData('/totalCollectionLength/Opportunities', { currentNumber: currentNumber, status: this.wfStatus,  isConverted: this.convertedStatus }, function (response, context) {
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

                common.populateWorkflowsList("Opportunities", ".filter-check-list", ".filter-check-list", "/Workflows", null, function(stages) {
                    self.stages = stages;
                    itemView.trigger('incomingStages', stages);
                });

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            previousPage: function (event) {
                event.preventDefault();
                this.prevP({status: this.wfStatus,  isConverted: this.convertedStatus});
                dataService.getData('/totalCollectionLength/Opportunities', {status: this.wfStatus,  isConverted: this.convertedStatus}, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            nextPage: function (event) {
                event.preventDefault();
                this.nextP({status: this.wfStatus,  isConverted: this.convertedStatus});
                dataService.getData('/totalCollectionLength/Opportunities', {status: this.wfStatus,  isConverted: this.convertedStatus}, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;
                this.getTotalLength(null, itemsNumber);
                this.collection.showMore({ count: itemsNumber, page: 1, status: this.wfStatus,  isConverted: this.convertedStatus });
            },

            showPage: function (event) {
                event.preventDefault();
                this.showP(event,{status: this.wfStatus,  isConverted: this.convertedStatus});
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
                window.location.hash = "#easyErp/Opportunities/form/" + id;
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
                this.deleteRender(deleteCounter, deletePage, {status: this.wfStatus,  isConverted: this.convertedStatus});
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

        return OpportunitiesListView;
    });
