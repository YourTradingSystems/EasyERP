define([
    "text!templates/Users/list/UsersItemTemplate.html"
],
    function (UsersItemTemplate) {
        var UsersItemView = Backbone.View.extend({
            tagName:"tr",

            initialize: function(){
                this.render();
            },

            template: _.template(UsersItemTemplate),

            render: function(){
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return UsersItemView;
    });