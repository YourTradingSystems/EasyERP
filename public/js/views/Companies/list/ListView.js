define([
    'text!templates/Companies/list/ListHeader.html',
    'views/Companies/CreateView',
    'views/Companies/list/ListItemView'
],

function (CompaniesListTemplate, CreateView, ListItemView) {
    var CompaniesListView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.startNumber = 0;
            this.render();
        },

        events: {
            "click #showMore": "showMore",
            "click .checkbox": "checked",
            "click  .list td:not(:has('input[type='checkbox']'))": "gotoForm"
        },

        render: function () {

            console.log('Companies render');
            this.$el.html(_.template(CompaniesListTemplate));
            this.$el.append(new ListItemView({ collection: this.collection, startNumber: this.startNumber }).render());
            $('#check_all').click(function () {
                var c = this.checked;
                $(':checkbox').prop('checked', c);
            });
            this.startNumber += this.collection.length;
            this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({count: 50});
        },

        showMoreContent: function (newModels) {
            new ListItemView({ collection: newModels, startNumber: this.startNumber }).render();
            this.startNumber += newModels.length;
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
                if ($("input:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
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

    return CompaniesListView;
});
