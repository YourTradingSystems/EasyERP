define([
        "text!templates/Opportunities/kanban/KanbanItemTemplate.html",
        "collections/Opportunities/OpportunitiesCollection",
        "common"
],
    function (KanbanItemTemplate, OpportunitiesCollection, common) {
        var OpportunitiesItemView = Backbone.View.extend({
            className: "opportunity",
            id: function () {
                return this.model.get("_id");
            },

            initialize: function () {
                this.model.on('change', this.render, this);
                this.collection = new OpportunitiesCollection();
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
                var itemIndex = $(e.target).closest(".opporunity").data("index") + 1;
                window.location.hash = "#home/action-Opportunities/Edit/" + itemIndex;
            },

            gotoForm: function (e) {
                var itemIndex = $(e.target).closest(".opportunity").data("index") + 1;
                App.ownContentType = true;
                window.location.hash = "home/content-Opportunities/form/" + itemIndex;
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
                this.$(".colorPicker a").closest(".opportunity-header").css('background-color', color).closest(".opportunity").css('border-color', color);
            },

            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                this.changeColor(this.model.get('color'));
                this.$el.attr("data-index", this.model.collection.indexOf(this.model));
                return this;
            }
        });

        return OpportunitiesItemView;
    });