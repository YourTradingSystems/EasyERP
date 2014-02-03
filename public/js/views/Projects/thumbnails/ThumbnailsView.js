define([
    "text!templates/Projects/thumbnails/ThumbnailsItemTemplate.html",
    'views/Projects/EditView',
    'views/Projects/CreateView',
    'dataService',
    'models/ProjectsModel',
    'common'
],

function (thumbnailsItemTemplate, editView, createView, dataService, currentModel, common) {
    var ProjectThumbnalView = Backbone.View.extend({
        el: '#content-holder',
        countPerPage: 0,
        template: _.template(thumbnailsItemTemplate),

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.countPerPage = options.collection.length;
            this.getTotalLength(this.countPerPage);
            this.render();
            this.asyncLoadImgs();
        },

        events: {
            "click #showMore": "showMore",
            "click .thumbnail": "gotoEditForm"
        },

        getTotalLength: function (currentNumber) {
            dataService.getData('/totalCollectionLength/Projects', { currentNumber: currentNumber }, function (response, context) {
                var showMore = context.$el.find('#showMoreDiv');
                if (response.showMore) {
                    if (showMore.length === 0) {
                        var created = context.$el.find('#timeRecivingDataFromServer');
                        created.before('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
                    } else {
                        showMore.show();
                    }
                } else {
                    showMore.hide();
                }
            }, this);
        },

        asyncLoadImgs: function () {
            var arr = _.filter(this.collection.toJSON(), function (item) {
                return item.projectmanager !== undefined;
            });
            var ids = _.map(arr, function (item) {
                return item.projectmanager._id;
            });
            common.getImages(ids, "/getEmployeesImages");
        },

        render: function () {
            var currentEl = this.$el;
            var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";

            currentEl.html('');

            if (this.collection.length > 0) {
                currentEl.append(this.template({ collection: this.collection.toJSON() }));
            } else {
                currentEl.html('<h2>No projects found</h2>');
            }

            currentEl.append(createdInTag);
            return this;
        },

        gotoEditForm: function (e) {
            var clas = $(e.target).parent().attr("class");
            if ((clas === "dropDown") || (clas === "inner")) {
            } else {
                e.preventDefault();
                var id = $(e.target).closest('.thumbnail').attr("id");
                var model = new currentModel({validate: false});
                model.urlRoot = '/Projects/form/' + id;
                model.fetch({
                    success: function (model) {
                        new editView({ model: model });
                    },
                    error: function () { alert('Please refresh browser'); }
                });
            }
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore();
        },

        showMoreContent: function (newModels) {
            var holder = this.$el.find('#showMoreDiv');
            var thumbnailsItemView;
            var counter = 0;
            var namberOfprojects = this.collection.namberToShow;

            if (arrayOfProjects.length > 0) {
                for (var i = 0; i < arrayOfProjects.length; i++) {
                    if (counter < namberOfprojects) {
                        counter++;
                        dataIndexCounter++;
                        thumbnailsItemView = new ProjectsThumbnailsItemView({ model: arrayOfProjects[i], dataIndex: dataIndexCounter });
                        thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                        holder.before(thumbnailsItemView.render().el);
                        arrayOfProjects.splice(i, 1);
                        i--;
                    }
                }

            }
            _.each(newModels.models, function (model) {
                if (counter < namberOfprojects) {
                    counter++;
                    dataIndexCounter++;
                    thumbnailsItemView = new ProjectsThumbnailsItemView({ model: model });
                    thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                    $(holder).prepend(thumbnailsItemView.render().el);
                } else {
                    arrayOfProjects.push(model);
                }

            }, this);

            if (arrayOfProjects.length == 0) {
                this.$el.find('#showMoreDiv').hide();
            }
        },

        createItem: function () {
            //create editView in dialog here
            new createView();
        },

        editItem: function () {
            //create editView in dialog here
            new editView({ collection: this.collection });
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

    return ProjectThumbnalView;
});
