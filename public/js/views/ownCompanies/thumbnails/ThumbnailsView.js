define([
   'views/ownCompanies/thumbnails/ThumbnailsItemView',
    'custom',
    'common',
    'views/ownCompanies/EditView',
    'views/ownCompanies/CreateView'
],

function (OwnCompaniesThumbnailsItemView, Custom, common, EditView, CreateView) {
    var CompanyThumbnalView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
			this.startTime = options.startTime;
            this.collection = options.collection;
            arrayOfOwnCcompanies = [];
            dataIndexCounter = 0;
            this.render();
        },

        events: {
            "click #showMore": "showMore"
        },

        render: function () {
            var namberOfOwnCompanies = this.collection.namberToShow;
            console.log('Company render');
            this.$el.html('');
            if (this.collection.length > 0) {
                var holder = this.$el;
                var thumbnailsItemView;
                _.each(this.collection.models, function (model, index) {
                    if (index < namberOfOwnCompanies) {
                        dataIndexCounter++;
                        thumbnailsItemView = new OwnCompaniesThumbnailsItemView({ model: model, dataIndex: dataIndexCounter });
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        $(holder).append(thumbnailsItemView.render().el);
                    } else {
                        arrayOfOwnCcompanies.push(model);
                    }
                }, this);
            } else {
                this.$el.html('<h2>No Companies found</h2>');
            }
            if (arrayOfOwnCcompanies.length > 0) {
                this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
            }
			this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");
            return this;
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore();
        },

        showMoreContent: function (newModels) {
            var holder = this.$el.find('#showMoreDiv');
            var thumbnailsItemView;
            var counter =0;
            var namberOfOwnCompanies = this.collection.namberToShow;

            if (arrayOfOwnCcompanies.length > 0) {
                for (var i=0; i<arrayOfOwnCcompanies.length; i++) {
                    if (counter < namberOfOwnCompanies ) {
                        counter++;
                        dataIndexCounter++;
                        thumbnailsItemView = new OwnCompaniesThumbnailsItemView({ model: arrayOfOwnCcompanies[i], dataIndex: dataIndexCounter });
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        holder.before(thumbnailsItemView.render().el);
                        arrayOfOwnCcompanies.splice(i,1);
                        i--;
                    }
                }
            }
            _.each(newModels.models, function (model) {
                    if (counter < namberOfOwnCompanies) {
                        dataIndexCounter++;
                        thumbnailsItemView = new OwnCompaniesThumbnailsItemView({ model: model, dataIndex: dataIndexCounter  });
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        $(holder).prepend(thumbnailsItemView.render().el);
                    } else {
                        arrayOfOwnCcompanies.push(model);
                    }
            }, this);

            if (arrayOfOwnCcompanies.length == 0) {
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

    return CompanyThumbnalView;
});
