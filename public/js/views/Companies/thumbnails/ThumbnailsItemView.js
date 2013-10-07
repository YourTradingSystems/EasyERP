define([
    "text!templates/Companies/thumbnails/ThumbnailsItemTemplate.html"
],
    function (ThumbnailsItemTemplate) {
        var ThumbnailsItemView = Backbone.View.extend({
            tagName:"div",
            className: "thumbnail",

            initialize: function(){
                this.render();
            },

            events: {
                "click": "gotoForm"
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = $(e.target).data("index") + 1;
                window.location.hash = "#home/content-Companies/form/" + itemIndex;
            },

            template: _.template(ThumbnailsItemTemplate),

            render: function () {
                var index = this.model.collection.indexOf(this.model);
                this.$el.html(this.template(this.model.toJSON()));
                this.$el.attr("data-index", index);
                return this;
            }
        });

        return ThumbnailsItemView;
    });