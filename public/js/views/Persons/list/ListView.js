define([
    'text!templates/Persons/list/ListHeader.html',
    'views/Persons/CreateView',
    'views/Persons/list/ListItemView'
],

function (ListTemplate, CreateView, ListItemView) {
    var PersonsListView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.startNumber = 0;
            this.render();
        },

        events: {
            //"click #showMore": "showMore",
            "click .itemsNumber": "showMore",
            "click .showPage": "showPage",
            "change #currentShowPage": "showPage",
            "click #previousPage": "previousPage",
            "click #nextPage": "nextPage",


            "click .checkbox": "checked",
            "click  .list td:not(:has('input[type='checkbox']'))": "gotoForm"
        },

        render: function () {
            debugger;
            console.log('Persons render');
            $('.ui-dialog ').remove();
            this.$el.html(_.template(ListTemplate));
            this.$el.append(new ListItemView({ collection: this.collection, startNumber: this.startNumber }).render());
            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            });
            this.startNumber += this.collection.length;

            $("#pageList").empty();
            var itemsNumber = $("#itemsNumber").text();
            $("#currentShowPage").val(1);
            var pageNumber = Math.ceil(this.collection.listLength/itemsNumber);
            for (var i=1;i<=pageNumber;i++) {
                $("#pageList").append('<li class="showPage">'+ i +'</li>')
            }
            $("#lastPage").text(pageNumber);
            $("#previousPage").prop("disabled",true);

            if (pageNumber == 1) {
                $("#nextPage").prop("disabled",true);
            }
           // this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
        },

        previousPage: function (event) {
            event.preventDefault();
            var itemsNumber = $("#itemsNumber").text();
            var page = parseInt($("#currentShowPage").val()) - 1;
            $("#currentShowPage").val(page);
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({count: itemsNumber, page: page});
            $("#nextPage").prop("disabled",false);
        },

        nextPage: function (event) {
            event.preventDefault();
            var itemsNumber = $("#itemsNumber").text();
            var page =  parseInt($("#currentShowPage").val()) + 1;
            $("#currentShowPage").val(page);
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({count: itemsNumber, page: page});
            $("#previousPage").prop("disabled",false);
        },

        showMore: function (event) {
            event.preventDefault();
            var itemsNumber = event.target.textContent;
            $("#itemsNumber").text(itemsNumber);
            $("#currentShowPage").val(1);
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


            $("#itemsNumber").text(itemsNumber);
            $("#currentShowPage").val(page);
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({count: itemsNumber, page: page});
        },

        showMoreContent: function (newModels) {
            $("#listTable").empty();
            new ListItemView({ collection: newModels, startNumber: this.startNumber }).render();
            $("#pageList").empty();
            var itemsNumber = $("#itemsNumber").text();
            var pageNumber = Math.ceil(this.collection.listLength/itemsNumber);
            var currentPage = $("#currentShowPage").val();
            for (var i=currentPage;i<=pageNumber;i++) {
                $("#pageList").append('<li class="showPage">'+ i +'</li>')
            }
            $("#lastPage").text(pageNumber);
            this.startNumber += newModels.length;

            if (currentPage == 1) {
                $("#previousPage").prop("disabled",true);
            } else {
                $("#previousPage").prop("disabled",false);
            }

            if (currentPage == pageNumber) {
                $("#nextPage").prop("disabled",true);
            } else {
                $("#nextPage").prop("disabled",false);
            }

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
            $.each($("tbody input:checked"), function (index, checkbox) {
                model = that.collection.get(checkbox.value);
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
            });

            this.collection.trigger('reset');
        }

    });

    return PersonsListView;
});
