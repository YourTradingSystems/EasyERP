define([
    "text!templates/Projects/thumbnails/ThumbnailsItemTemplate.html",
    "common"
],
    function (ThumbnailsItemTemplate, common) {
        var ThumbnailsItemView = Backbone.View.extend({
            tagName: "div",
            className: "thumbnail",

            initialize: function () {
                this.render();
            },

            events: {
                "click #tasksKanban,  #tasksList": "gotoTasks",
                "click": "gotoEditForm"
                //"click #delete": "deleteEvent",
                //"click .dropDown > a": "openDropDown",
                //"click .colorPicker a": "pickColor",
                //"click #edit": "gotoEditForm"
            },

            gotoEditForm: function (e) {
				if ($(e.target).attr("class")=="tasksByProject"){
					return;
				}
                e.preventDefault();
                var id = this.$el.closest(".thumbnail").attr("id");
                if ($(e.target).parent().attr("class") != "dropDown") {
                    window.location.hash = "#home/action-Projects/Edit/" + id;
                }
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

            gotoTasks: function (e) {
                e.preventDefault();
                App.ownContentType = true;
                if ($(e.target).attr("id") == "tasksKanban") {
                    Backbone.history.navigate("#easyErp/Tasks/kanban/" + this.model.get("_id"), { trigger: true });
                } else {
                    Backbone.history.navigate("#easyErp/Tasks/list", { trigger: true });
                }
				return false;
            },
            
            

            template: _.template(ThumbnailsItemTemplate),

            render: function () {
                var color = common.hexToRgb(this.model.get('color'));
                this.$el.attr("data-index", this.model.collection.indexOf(this.model));
                this.$el.html(this.template(this.model.toJSON()));
                this.$el.attr("id", this.model.get('_id'));
                this.$el.css('background-color', 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 0.20)');
                this.$('p').css({ 'color': this.model.get('color'), 'font-weight': 'bold', 'text-shadow': '0 1px 1px rgba(' + 255 + ',' + 255 + ',' + 255 + ', 0.5)' });
                return this;
            }
        });

        return ThumbnailsItemView;
    });
