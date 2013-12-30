define([
    "text!templates/Birthdays/list/ListItemTemplate.html",
    "common"
],
    function (ListItemTemplate, common) {
        var ListItemView = Backbone.View.extend({

            initialize: function (options) {
                this.collection = options.collection;
                //this.render();
            },

            events: {
                "click a": "gotoForm"
            },

            gotoForm: function (e) {
                e.preventDefault();
                App.ownContentType = true;
                var id = $(e.target).closest("a").data("id");
                window.location.hash = "#easyErp/Employees/form/" + id;
            },

            template: _.template(ListItemTemplate),

            render: function () {
                ////var that = this;
                //_.each(this.collection, function (model, index) {
                //    this.$el.attr("data-index", index);
                this.$el.html(this.template({ collection: this.collection }));
                //}, this);
                
                return this;
            }
        });

        return ListItemView;
    });