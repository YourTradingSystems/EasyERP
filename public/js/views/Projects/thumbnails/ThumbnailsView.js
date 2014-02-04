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
            this.asyncLoadImgs(this.collection);
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

        asyncLoadImgs: function (collection) {
            var arr = _.filter(collection.toJSON(), function (item) {
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
            var holder = this.$el;
            this.countPerPage += newModels.length;
            var showMore = holder.find('#showMoreDiv');
            var created = holder.find('#timeRecivingDataFromServer');
            this.getTotalLength(this.countPerPage);
            showMore.before(this.template({ collection: this.collection.toJSON() }));
            showMore.after(created);
            this.asyncLoadImgs(newModels);
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
            var mid = 39,
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
