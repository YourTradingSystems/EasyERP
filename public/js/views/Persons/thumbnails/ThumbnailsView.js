define([
   'views/Persons/thumbnails/ThumbnailsItemView',
    'custom',
    'common',
    'views/Persons/EditView',
    'views/Persons/CreateView',
    'text!templates/Alpabet/AphabeticTemplate.html'
],

function (PersonsThumbnailsItemView, Custom, common, EditView, CreateView, AphabeticTemplate) {
    var PersonsThumbnalView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            arrayOfPersons = [];
            dataIndexCounter = 0;
            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.selectedLetter = "";
            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.render();
        },

        events: {
            "click #showMore": "showMore",
            "click .letter:not(.empty)": "alpabeticalRender"
        },

        alpabeticalRender: function (e) {
            $(e.target).parent().find(".current").removeClass("current");
            $(e.target).addClass("current");
            this.selectedLetter = $(e.target).text();
            if ($(e.target).text() == "All") {
                this.selectedLetter = "";
            }
            this.collection.showMoreAlphabet({ count: 50, page: 1, letter: this.selectedLetter });
        },
        render: function () {
            var self = this;
            var namberOfpersons = this.collection.namberToShow;
            $('.ui-dialog ').remove();
            console.log('Person render');
            this.$el.html('');
            if (this.collection.length > 0) {
                var holder = this.$el;
                var thumbnailsItemView;
                _.each(this.collection.models, function (model, index) {
                    if (index < namberOfpersons) {
                        dataIndexCounter++;
                        thumbnailsItemView = new PersonsThumbnailsItemView({ model: model, dataIndex: dataIndexCounter });
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
            common.buildAphabeticArray(this.collection, function (arr) {
                $(".startLetter").remove();
                self.alphabeticArray = arr;
                self.$el.prepend(_.template(AphabeticTemplate, { alphabeticArray: self.alphabeticArray, selectedLetter: (self.selectedLetter == "" ? "All" : self.selectedLetter), allAlphabeticArray: self.allAlphabeticArray }));
            });
            this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            return this;
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({ letter: this.selectedLetter });
        },

        showMoreContent: function (newModels) {
            var holder = this.$el.find('#showMoreDiv');
            var thumbnailsItemView;
            var counter = 0;
            var namberOfPersons = this.collection.namberToShow;

            if (arrayOfPersons.length > 0) {
                for (var i = 0; i < arrayOfPersons.length; i++) {
                    if (counter < namberOfPersons) {
                        counter++;
                        dataIndexCounter++;
                        thumbnailsItemView = new PersonsThumbnailsItemView({ model: arrayOfPersons[i], dataIndex: dataIndexCounter });
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        holder.before(thumbnailsItemView.render().el);
                        arrayOfPersons.splice(i, 1);
                        i--;
                    }
                }

            }
            _.each(newModels.models, function (model) {
                if (counter < namberOfPersons) {
                    counter++;
                    dataIndexCounter++;
                    thumbnailsItemView = new PersonsThumbnailsItemView({ model: model, dataIndex: dataIndexCounter });
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
        showMoreAlphabet: function (newModels) {
            arrayOfPersons = [];
            var alphaBet = this.$el.find('#content-holder .startLetter');
            var created = this.$el.find('#timeRecivingDataFromServer');
            var holder = this.$el;
            $("#content-holder .thumbnailwithavatar").remove();
            var thumbnailsItemView;
            var counter = 0;
            var namberOfPersons = this.collection.namberToShow;

            if (arrayOfPersons.length > 0) {
                for (var i = 0; i < arrayOfPersons.length; i++) {
                    if (counter < namberOfPersons) {
                        counter++;
                        dataIndexCounter++;
                        thumbnailsItemView = new PersonsThumbnailsItemView({ model: arrayOfPersons[arrayOfPersons.length - i - 1], dataIndex: dataIndexCounter });
                        holder.append(thumbnailsItemView.render().el);
                        arrayOfPersons.splice(arrayOfPersons.length - i - 1, 1);
                        i--;
                    }
                }

            }
            _.each(newModels.models, function (model) {
                if (counter < namberOfPersons) {
                    counter++;
                    dataIndexCounter++;
                    thumbnailsItemView = new PersonsThumbnailsItemView({ model: model, dataIndex: dataIndexCounter });
                    holder.append(thumbnailsItemView.render().el);
                } else {
                    arrayOfPersons.push(model);
                }
            }, this);

            if (arrayOfPersons.length == 0) {
                this.$el.find('#showMoreDiv').hide();
            }
            else {
                this.$el.find('#showMoreDiv').show();
            }
            holder.prepend(alphaBet);
            holder.append(created);
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
