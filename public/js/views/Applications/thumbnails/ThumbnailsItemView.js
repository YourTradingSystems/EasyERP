define([
    "text!templates/Applications/thumbnails/ThumbnailsItemTemplate.html"
],
    function (TasksItemTemplate) {
        var ApplicationsItemView = Backbone.View.extend({
            tagName: "div",
            className: "thumbnail",

            initialize: function () {
                this.render();
            },

            events: {
                "click":"gotoForm"
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = $(e.target).data("index") + 1;
                window.location.hash = "#home/content-Applications/form/" + itemIndex;
            },

            template: _.template(TasksItemTemplate),

            hexToRgb: function (hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            },

            render: function () {
                var color = this.hexToRgb(this.model.get('color'));
                var index = this.model.collection.indexOf(this.model);
                this.$el.html(this.template(this.model.toJSON()));
                this.$el.attr("data-index", index);
                this.$el.css('background-color', 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 0.20)');
                this.$('span').css({ 'color': this.model.get('color'), 'font-weight': 'bold', 'text-shadow': '0 1px 1px rgba('+255+','+ 255+','+ 255+', 0.5)' });
                return this;
            }
        });

        return ApplicationsItemView;
    });