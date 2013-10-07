define([
    "text!templates/Employees/thumbnails/ThumbnailsItemTemplate.html",
],
    function (ThumbnailsItemTemplate, TasksContentView, TasksCollection) {
        var ThumbnailsItemView = Backbone.View.extend({
            tagName: "div",
            className: "thumbnail",

            initialize: function () {
                this.render();
            },

            events: {
                "click": "gotoForm"
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = $(e.target).data("index") + 1;
                window.location.hash = "#home/content-Employees/form/" + itemIndex;
            },

            template: _.template(ThumbnailsItemTemplate),

            render: function () {
                var index = this.model.collection.indexOf(this.model);
                this.$el.attr("data-index", index);
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return ThumbnailsItemView;
    });