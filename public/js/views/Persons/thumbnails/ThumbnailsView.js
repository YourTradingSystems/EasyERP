define([
   'views/Persons/thumbnails/ThumbnailsItemView',
    'custom',
    'common',
    'views/Persons/EditView',
    'views/Persons/CreateView'
],

function (ThumbnailsItemView, Custom, common, EditView, CreateView) {
    var PersonsThumbnalView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.collection = options.collection;
            this.render();

        },

        events: {
            "click #showMore": "showMore"
        },

        render: function () {
            arrayOfPersons = [];
            var namberOfpersons = this.collection.namberToShow;
        	$('.ui-dialog ').remove();
            console.log('Person render');
            this.$el.html('');
            if (this.collection.length > 0) {
                var holder = this.$el;
                var thumbnailsItemView;
                _.each(this.collection.models, function (model,index) {
                        if (index < namberOfpersons) {
                            thumbnailsItemView = new ThumbnailsItemView({ model: model });
                            thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                            $(holder).append(thumbnailsItemView.render().el);
                        } else {
                            arrayOfPersons.push(model);
                        }
                }, this);
            } else {
                this.$el.html('<h2>No persons found</h2>');
            }

            if (arrayOfPersons.length > 0) {
                this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
            }
            return this;
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({ count: 20 });
        },

        showMoreContent: function (newModels) {
            var holder = $('#showMoreDiv');
            var thumbnailsItemView;
            var counter =0;
            var namberOfPersons = this.collection.namberToShow;

            if (arrayOfPersons.length > 0) {
                for (var i=0; i<arrayOfPersons.length; i++) {
                    if (counter < namberOfPersons ) {
                        counter++;
                        thumbnailsItemView = new ThumbnailsItemView({ model: arrayOfPersons[i]});
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        holder.before(thumbnailsItemView.render().el);
                        arrayOfPersons.splice(i,1);
                        i--;
                    }
                }

            }
            _.each(newModels.models, function (model) {
                if (counter < namberOfPersons) {
                    thumbnailsItemView = new ThumbnailsItemView({ model: model });
                    thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                    holder.before(thumbnailsItemView.render().el);
                } else {
                    arrayOfPersons.push(model);
                }
            }, this);

            if (arrayOfPersons.length == 0) {
                this.$el.find('#showMoreDiv').hide();
            }
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

    return PersonsThumbnalView;
});
