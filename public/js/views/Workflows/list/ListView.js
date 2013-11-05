define([
    "text!templates/Workflows/list/ListTemplate.html"
],
    function (ListItemTemplate) {
        var ListItemView = Backbone.View.extend({

            initialize: function () {
                //this.render();
            },

            template: _.template(ListItemTemplate),

            render: function () {
                this.$el.html(this.template({ model: this.model }));
                return this;
            }
        });

        return ListItemView;
    });