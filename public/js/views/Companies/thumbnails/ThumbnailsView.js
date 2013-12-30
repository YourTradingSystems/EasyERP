define([
   'views/Companies/thumbnails/ThumbnailsItemView',
    'custom',
    'common',
    'views/Companies/EditView',
    'views/Companies/CreateView',
    'text!templates/Alpabet/AphabeticTemplate.html'
],

function (ThumbnailsItemView, Custom, common, EditView, CreateView, AphabeticTemplate) {
    var CompanyThumbnalView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.collection = options.collection;
            arrayOfcompanies = [];
            dataIndexCounter = 0;
			this.alphabeticArray = this.buildAphabeticArray(this.collection.toJSON());
			this.allAlphabeticArray = this.buildAllAphabeticArray();
			this.selectedLetter="";
            this.render();
        },

        events: {
            "click #showMore": "showMore",
			"click .letter:not(.empty)": "alpabeticalRender"
        },
		buildAphabeticArray: function (collection) {
			if (collection && collection.length > 0) {
				var filtered = $.map(collection, function (item) {
					if (item.name.first[0]) {
						if ($.isNumeric(item.name.first[0].toUpperCase())) {
							return "0-9"
						}
						return item.name.first[0].toUpperCase();
					}
				});
				filtered.push("All");
				return _.sortBy(_.uniq(filtered), function (a) { return a });
			}
			return [];
		},
		buildAllAphabeticArray: function () {
			var associateArray = ["All", "0-9"]
			for (i = 65; i <= 90; i++) {
				associateArray.push(String.fromCharCode(i).toUpperCase());
			}
			return associateArray;
		},
		alpabeticalRender:function(e){
			$(e.target).parent().find(".current").removeClass("current");
			$(e.target).addClass("current");
            _.bind(this.collection.showMore, this.collection);
			this.selectedLetter=$(e.target).text();
			if ($(e.target).text()=="All"){
				this.selectedLetter="";
			}
            this.collection.showMore({count: 50, page: 1, letter:this.selectedLetter});
		},

        render: function () {
            var namberOfcompanies = this.collection.namberToShow;
            console.log('Company render');
            $('.ui-dialog ').remove();
            this.$el.html(_.template(AphabeticTemplate, { alphabeticArray: this.alphabeticArray,selectedLetter: (this.selectedLetter==""?"All":this.selectedLetter),allAlphabeticArray:this.allAlphabeticArray}));
            if (this.collection.length > 0) {
                var holder = this.$el;
                var thumbnailsItemView;
                _.each(this.collection.models, function (model, index) {
                    if (index < namberOfcompanies) {
                        dataIndexCounter++;
                        thumbnailsItemView = new ThumbnailsItemView({ model: model, dataIndex: dataIndexCounter });
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        $(holder).append(thumbnailsItemView.render().el);
                    } else {
                        arrayOfcompanies.push(model);
                    }
                }, this);
            } else {
                this.$el.html('<h2>No Companies found</h2>');
            }
            if (arrayOfcompanies.length > 0) {
                this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
            }
            return this;
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore();
        },

        showMoreContent: function (newModels) {
            var holder = $('#content-holder');
            this.$el.html(_.template(AphabeticTemplate, { alphabeticArray: this.alphabeticArray,selectedLetter: (this.selectedLetter==""?"All":this.selectedLetter),allAlphabeticArray:this.allAlphabeticArray}));
            var thumbnailsItemView;
            var counter =0;
            var namberOfcompanies = this.collection.namberToShow;

            if (arrayOfcompanies.length > 0) {
                for (var i=0; i<arrayOfcompanies.length; i++) {
                    if (counter < namberOfcompanies ) {
                        counter++;
                        dataIndexCounter++;
                        thumbnailsItemView = new ThumbnailsItemView({ model: arrayOfcompanies[i], dataIndex: dataIndexCounter });
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        holder.append(thumbnailsItemView.render().el);
                        arrayOfcompanies.splice(i,1);
                        i--;
                    }
                }
            }
            _.each(newModels.models, function (model) {
                    if (counter < namberOfcompanies) {
                        dataIndexCounter++;
                        counter++;
                        thumbnailsItemView = new ThumbnailsItemView({ model: model, dataIndex: dataIndexCounter  });
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        $(holder).append(thumbnailsItemView.render().el);
                    } else {
                        arrayOfcompanies.push(model);
                    }
            }, this);

            if (arrayOfcompanies.length == 0) {
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
