define([
    "text!templates/Companies/thumbnails/ThumbnailsItemTemplate.html",
    "common"
],
    function (ThumbnailsItemTemplate, common) {
        var ThumbnailsItemView = Backbone.View.extend({
            tagName:"div",
            className: "thumbnailcusomers",

            initialize: function () {
                this.model.on('change', this.render, this);
                this.render();
            },

            events: {
                "click": "gotoForm",
                "click #delete": "deleteEvent",
                "click .dropDown > a": "openDropDown",
                "click .colorPicker a": "pickColor",
                "click #edit": "gotoEditForm"
            },

            gotoEditForm: function (e) {
                e.preventDefault();
                var itemIndex = this.$el.data("index") + 1;
                window.location.hash = "#home/action-Companies/Edit/" + itemIndex;
            },

            openDropDown: function (e) {
                e.preventDefault();
                this.$(".dropDown > a").toggleClass("selected").siblings(".dropDownOpened").fadeToggle("normal");
            },

            pickColor: function (e) {
                e.preventDefault();
                var mid = 39;
                var color = $(e.target).data("color");
                this.changeColor(color);
                this.model.set({ color: color });
                this.model.save({ color: color }, {
                    headers: {
                        mid: mid
                    }
                });
            },

            changeColor: function (color) {
                var rgbColor = common.hexToRgb(color);
                this.$el.css('background-color', 'rgba(' + rgbColor.r + ',' + rgbColor.g + ',' + rgbColor.b + ', 0.20)');
                this.$('p').css({ 'color': color, 'font-weight': 'bold', 'text-shadow': '0 1px 1px rgba(' + 255 + ',' + 255 + ',' + 255 + ', 0.5)' });
            },
            
            deleteEvent: function (e) {
                common.deleteEvent(e, this);
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                if ($(e.target).closest("div").attr("class") != "dropDown") {
                    var itemIndex = this.$el.data("index") + 1;
                    window.location.hash = "#home/content-Companies/form/" + itemIndex;
                }
            },

            template: _.template(ThumbnailsItemTemplate),

            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                this.$el.attr("data-index", this.model.collection.indexOf(this.model));
                this.$el.attr("id", this.model.get('_id'));
                this.changeColor(this.model.get('color'));
                common.contentHolderHeightFixer();
                return this;
            }
        });

        return ThumbnailsItemView;
    });