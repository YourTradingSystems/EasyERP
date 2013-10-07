define([
        "text!templates/Applications/kanban/KanbanItemTemplate.html",
        "collections/Applications/ApplicationsCollection",
        'custom'
],
    function (KanbanItemTemplate, ApplicationsCollection, Custom) {
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
                "click #delete": "deleteItem",
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

            deleteItem: function (e) {
                e.preventDefault();
                mid = 39;
                var that = this;
                var model = that.collection.get($(e.target).closest(".application").attr("id"));
                this.$("#delete").closest(".application").fadeToggle(300, function () {
                    model.destroy(
                        {
                            headers: {
                                mid: mid
                            }
                        },
                        { wait: true });
                    $(this).remove();
                });
                var column = this.$el.closest(".column");
                column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                this.collection.trigger('reset');
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
                var todayString = new Date().format("yyyy-mm-dd");
                this.$el.html(this.template(this.model.toJSON()));
                this.changeColor(this.model.get('color'));
                this.$el.attr("data-index", index);
                return this;
            }
        });

        return ApplicationsItemView;
    });