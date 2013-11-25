//define([
//    "text!templates/Workflows/list/ListTemplate.html"
//],
//    function (ListTemplate) {
//        var ListItemView = Backbone.View.extend({
//            tagName: "table",
//            id: "workflows",
//            initialize: function () {
//                //this.render();
//            },

//            template: _.template(ListTemplate),

//            render: function () {
//                this.$el.html(this.template({ model: this.model }));
//                return this;
//            }
//        });

//        return ListItemView;
//    });