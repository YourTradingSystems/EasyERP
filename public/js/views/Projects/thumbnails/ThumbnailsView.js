define([
   'views/Projects/thumbnails/ThumbnailsItemView',
    'custom',
    'common',
    'views/Projects/EditView',
    'views/Projects/CreateView'
],

function (ProjectsThumbnailsItemView, Custom, common, EditView, CreateView) {
    var ProjectThumbnalView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.collection = options.collection;
            this.render();
        },

        events: {
            "click #showMore": "showMore"
        },

        render: function () {
            console.log('Project render');
            this.$el.html('');
            if (this.collection.length > 0) {
                var holder = this.$el;
                var thumbnailsItemView;
                _.each(this.collection.models, function (model) {
                    thumbnailsItemView = new ProjectsThumbnailsItemView({ model: model });
                    thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                    $(holder).append(thumbnailsItemView.render().el);
                }, this);
            } else {
                this.$el.html('<h2>No projects found</h2>');
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
                thumbnailsItemView = new ProjectsThumbnailsItemView({ model: model });
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
                model,
                viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "kanban":
                    {
                        model = this.model;
                        var remaining = model.get("estimated") - model.get("logged");
                        this.$("#delete").closest(".task").fadeToggle(200, function () {
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                            $(this).remove();
                        });
                        var column = this.$el.closest(".column");
                        column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                        column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) - remaining);
                        $('.popup').html(new Date() - start);
                        $('#popup-holder').fadeIn();
                        setTimeout(function () {
                            $('#popup-holder').fadeOut();
                            $('.popup').html('');

                        }, 3000);
                        break;
                    }
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = that.collection.get(checkbox.value);
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                        });

                        this.collection.trigger('reset');
                        break;
                    }
                case "thumbnails":
                    {
                        model = this.model.collection.get(this.$el.attr("id"));
                        this.$el.fadeToggle(200, function () {
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                            $(this).remove();
                        });
                        break;
                    }
                case "form":
                    {
                        model = this.collection.get($(".form-holder form").data("id"));
                        var itemIndex = this.collection.indexOf(model);
                        model.on('change', this.render, this);
                        model.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function (model) {
                                model = model.toJSON();
                                if (!model.project.id) {
                                    Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });

                                } else {
                                    Backbone.history.navigate("home/content-Tasks/kanban/" + model.project.id, { trigger: true });
                                }
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ProjectThumbnalView;
});
