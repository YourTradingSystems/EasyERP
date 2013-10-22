define([
        "text!templates/Applications/kanban/KanbanItemTemplate.html",
        "collections/Applications/ApplicationsCollection",
        "common"
],
    function (KanbanItemTemplate, ApplicationsCollection, common) {
        var ApplicationsItemView = Backbone.View.extend({
            className: "application",
            id: function () {
                return this.model.get("_id");
            },

            initialize: function () {
                this.model.on('change', this.render, this);
                this.collection = new ApplicationsCollection();
                this.collection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            events: {
                "click #delete": "deleteEvent",
                "click .dropDown > a": "openDropDown",
                "click .colorPicker a": "pickColor",
                "click .application-content": "gotoForm",
                "click #edit": "gotoEditForm"
            },

            template: _.template(KanbanItemTemplate),

            gotoEditForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest(".application").data("index") + 1;
                window.location.hash = "#home/action-Applications/Edit/" + itemIndex;
            },

            gotoForm: function (e) {
                var itemIndex = $(e.target).closest(".application").data("index") + 1;
                App.ownContentType = true;
                window.location.hash = "home/content-Applications/form/" + itemIndex;
            },

            deleteEvent: function (e) {
                common.deleteEvent(e, this);
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
            this.$(".colorPicker a").closest(".application-header").css('background-color', color).closest(".application").css('border-color', color);
        },

        render: function () {
            var index = this.model.collection.indexOf(this.model);
            this.$el.html(this.template(this.model.toJSON()));
            this.changeColor(this.model.get('color'));
            this.$el.attr("data-index", index);
            common.contentHolderHeightFixer();
            return this;
        }
    });

return ApplicationsItemView;
});