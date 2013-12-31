define([
   'views/Employees/thumbnails/ThumbnailsItemView',
    'custom',
    'common',
    'views/Employees/EditView',
    'views/Employees/CreateView',
    'text!templates/Alpabet/AphabeticTemplate.html'
],

function (EmployeesThumbnailsItemView, Custom, common, EditView, CreateView, AphabeticTemplate) {
    var EmployeeThumbnalView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.collection = options.collection;
            arrayOfEmployees = [];
            dataIndexCounter = 0;
            this.alphabeticArray = common.buildAphabeticArray(this.collection.toJSON());
            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.selectedLetter = "";
            this.render();
        },

        events: {
            "click #showMore": "showMore",
            "click .letter:not(.empty)": "alpabeticalRender"
        },
        alpabeticalRender: function (e) {
            $(e.target).parent().find(".current").removeClass("current");
            $(e.target).addClass("current");
            _.bind(this.collection.showMore, this.collection);
            this.selectedLetter = $(e.target).text();
            if ($(e.target).text() == "All") {
                this.selectedLetter = "";
            }
            this.collection.showMore({ count: 50, page: 1, letter: this.selectedLetter });
        },

        render: function () {
            var namberOfemployees = this.collection.namberToShow;
            $('.ui-dialog ').remove();
            this.$el.html('');
            this.$el.html(_.template(AphabeticTemplate, { alphabeticArray: this.alphabeticArray, selectedLetter: (this.selectedLetter == "" ? "All" : this.selectedLetter), allAlphabeticArray: this.allAlphabeticArray }));
            if (this.collection.length > 0) {
                var holder = this.$el;
                var thumbnailsItemView;
                _.each(this.collection.models, function (model, index) {
                    if (index < namberOfemployees) {
                        dataIndexCounter++;
                        thumbnailsItemView = new EmployeesThumbnailsItemView({ model: model, dataIndex: dataIndexCounter });
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        $(holder).append(thumbnailsItemView.render().el);
                    } else {
                        arrayOfEmployees.push(model);
                    }
                }, this);
            } else {
                this.$el.html('<h2>No Employees found</h2>');
            }

            if (arrayOfEmployees.length > 0) {
                this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
            }
            return this;
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore();
        },

        showMoreContent: function (newModels) {
            var holder = this.$el.find('#showMoreDiv');
            var thumbnailsItemView;
            var counter = 0;
            var namberOfemployees = this.collection.namberToShow;

            if (arrayOfEmployees.length > 0) {
                for (var i = 0; i < arrayOfEmployees.length; i++) {
                    if (counter < namberOfemployees) {
                        counter++;
                        dataIndexCounter++;
                        thumbnailsItemView = new EmployeesThumbnailsItemView({ model: arrayOfEmployees[i], dataIndex: dataIndexCounter });
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        holder.before(thumbnailsItemView.render().el);
                        arrayOfEmployees.splice(i, 1);
                        i--;
                    }
                }

            }
            _.each(newModels.models, function (model) {
                if (counter < namberOfemployees) {
                    counter++;
                    dataIndexCounter++;
                    thumbnailsItemView = new EmployeesThumbnailsItemView({ model: model, dataIndex: dataIndexCounter });
                    thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                    $(holder).before(thumbnailsItemView.render().el);
                } else {
                    arrayOfEmployees.push(model);
                }
            }, this);

            if (arrayOfEmployees.length == 0) {
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

    return EmployeeThumbnalView;
});
