define([
        "text!templates/Tasks/kanban/KanbanItemTemplate.html",
        "collections/Tasks/TasksCollection",
        "common"
],
    function (KanbanItemTemplate, TasksCollection, common) {
        var TasksItemView = Backbone.View.extend({
            className: "task",
            id: function () {
                return this.model.get("_id");
            },

            initialize: function () {
                this.model.on('change', this.render, this);
                this.collection = new TasksCollection();
                this.collection.bind('reset', _.bind(this.render, this));
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
                this.$el.html(this.template(this.model.toJSON()));
                if (this.isLater(todayString, deadlineString)) {
                    this.changeDeadlineColor();
                }
                this.changeColor(this.model.get('color'));
                this.$el.attr("data-index", index);
                return this;
            }
        });

        return TasksItemView;
    });