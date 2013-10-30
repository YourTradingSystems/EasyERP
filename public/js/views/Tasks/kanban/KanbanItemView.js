define([
        "text!templates/Tasks/kanban/KanbanItemTemplate.html",
        "common"
],
    function (KanbanItemTemplate, common) {
        var TasksItemView = Backbone.View.extend({
            className: "task",
            id: function () {
                return this.model.get("_id");
            },
            colors:[
                {dataColor: "#1ABC9C", className: "color_0"},
                {dataColor: "#2ECC71", className: "color_1"},
                {dataColor: "#3498DB", className: "color_2"},
                {dataColor: "#9B59B6", className: "color_3"},
                {dataColor: "#34495E", className: "color_4"},
                {dataColor: "#F1C40F", className: "color_5"},
                {dataColor: "#F39C12", className: "color_6"},
                {dataColor: "#E74C3C", className: "color_7"},
                {dataColor: "#27AE60", className: "color_8"},
                {dataColor: "#2980B9", className: "color_9"},

            ],

            initialize: function () {
                this.render();
            },

            events: {
                "click #delete": "deleteEvent",
                "click .dropDown > a": "openDropDown",
                "click .colorPicker a": "pickColor",
                "click .task-content": "gotoForm",
                "click #edit": "gotoEditForm"
            },

            template: _.template(KanbanItemTemplate),

            gotoEditForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest(".task").data("index") + 1;
                window.location.hash = "#home/action-Tasks/Edit/" + itemIndex;
            },

            gotoForm: function (e) {
                var itemIndex = $(e.target).closest(".task").data("index") + 1;
                App.ownContentType = true;
                window.location.hash = "home/content-Tasks/form/" + itemIndex;
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
                this.$(".colorPicker a").closest(".task-header").css('background-color', color).closest(".task").css('border-color', color);
            },

            isLater: function (str1, str2) {
                return new Date(str1) > new Date(str2);
            },

            changeDeadlineColor: function () {
                if ((this.$el.attr("id") == this.model.get('id'))) {
                    this.$(".deadline").css({ 'color': '#E74C3C' });
                }
            },

            render: function () {
                var index = this.model.collection.indexOf(this.model);
                var todayString = new Date().format("yyyy-mm-dd");
                if (this.model.get('deadline')) {
                    var deadlineString = this.model.get('deadline').split('T')[0];
                    this.model.set({ deadline: deadlineString.replace(/-/g, '/') }, { silent: true });
                }
                this.$el.html(this.template({model: this.model.toJSON(), colors: this.colors}));
                if (this.isLater(todayString, deadlineString)) {
                    this.changeDeadlineColor();
                }
                this.changeColor(this.model.get('color'));
                this.$el.attr("data-index", index);
                common.contentHolderHeightFixer();
                return this;
            }
        });

        return TasksItemView;
    });