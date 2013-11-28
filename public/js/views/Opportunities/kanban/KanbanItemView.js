define([
        "text!templates/Opportunities/kanban/KanbanItemTemplate.html",
        "common"
],
    function (KanbanItemTemplate, common) {
        var OpportunitiesItemView = Backbone.View.extend({
            className: "item",
            id: function () {
                return this.model.get("_id");
            },
            colors: [
               { dataColor: "#1ABC9C", className: "color_0" },
               { dataColor: "#2ECC71", className: "color_1" },
               { dataColor: "#3498DB", className: "color_2" },
               { dataColor: "#9B59B6", className: "color_3" },
               { dataColor: "#34495E", className: "color_4" },
               { dataColor: "#F1C40F", className: "color_5" },
               { dataColor: "#F39C12", className: "color_6" },
               { dataColor: "#E74C3C", className: "color_7" },
               { dataColor: "#27AE60", className: "color_8" },
               { dataColor: "#2980B9", className: "color_9" },

            ],

            initialize: function () {               
                this.render();
            },

            events: {
                "click #delete": "deleteEvent",
                "click .dropDown > a": "openDropDown",
                "click .colorPicker a": "pickColor",
                "click .inner": "gotoForm",
                "click #edit": "gotoEditForm"
            },

            template: _.template(KanbanItemTemplate),

            gotoEditForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest(".item").data("index") + 1;
                window.location.hash = "#home/action-Opportunities/Edit/" + itemIndex;
            },

            gotoForm: function (e) {
                var id = $(e.target).closest(".item").data("id");
                App.ownContentType = true;
                window.location.hash = "home/content-Opportunities/form/" + id;
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
                this.$(".colorPicker a").closest(".item").css('border-color', color);
            },

            render: function () {
                var index = this.model.collection.indexOf(this.model);
                //this.$el.html(this.template(this.model.toJSON()));
                //console.log(this.model);
                this.$el.html(this.template({ model: this.model.toJSON(), colors: this.colors }));
               
                this.changeColor(this.model.get('color'));
                this.$el.attr("data-index", index);
               // this.$el.attr("data-index", this.model.collection.indexOf(this.model));
                return this;
            }
        });

        return OpportunitiesItemView;
    });
