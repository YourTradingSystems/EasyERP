define([
    "text!templates/Persons/thumbnails/ThumbnailsItemTemplate.html"
],
    function (ThumbnailsItemTemplate) {
        var ThumbnailsItemView = Backbone.View.extend({
            tagName:"div",

            initialize: function(){
                this.render();
            },

            events: {
                "click": "gotoForm"
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = $(e.target).data("index") + 1;
                window.location.hash = "#home/content-Persons/form/" + itemIndex;
            },

            template: _.template(ThumbnailsItemTemplate),

            render: function(){
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return ThumbnailsItemView;
    });