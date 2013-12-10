define([
   'views/ownCompanies/thumbnails/ThumbnailsItemView',
    'custom',
    'common',
    'views/ownCompanies/EditView',
    'views/ownCompanies/CreateView'
],

function (ThumbnailsItemView, Custom, common, EditView, CreateView) {
    var CompanyThumbnalView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.collection = options.collection;
            this.render();
        },

        events: {
            "click #showMore": "showMore"
        },

        render: function () {
            console.log('Company render');
            this.$el.html('');
            if (this.collection.length > 0) {
                var holder = this.$el;
                var thumbnailsItemView;
                _.each(this.collection.models, function (model) {
                    thumbnailsItemView = new ThumbnailsItemView({ model: model });
                    thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                    $(holder).append(thumbnailsItemView.render().el);
                }, this);
            } else {
                this.$el.html('<h2>No Companies found</h2>');
            }
            this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
            return this;
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({ count: 20 });
        },

        showMoreContent: function (newModels) {
            var holder = this.$el.find('#showMoreDiv');
            var thumbnailsItemView;
            _.each(newModels.models, function (model) {
                thumbnailsItemView = new ThumbnailsItemView({ model: model });
                thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                $(holder).prepend(thumbnailsItemView.render().el);
            }, this);
        },

        createItem: function () {
            //create editView in dialog here
            new CreateView();
        },

        editItem: function () {
            //create editView in dialog here
            new EditView({ collection: this.collection });
        },

        deleteItems: function () {
            var that = this,
        		mid = 39,
                model;
            model = this.collection.get(this.$el.attr("id"));
            this.$el.fadeToggle(200, function () {
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
                $(this).remove();
            });
        }
    });

    return CompanyThumbnalView;
});
