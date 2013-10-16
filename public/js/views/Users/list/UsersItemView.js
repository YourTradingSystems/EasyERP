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
                this.$("td:nth-child(2)").append(this.model.collection.indexOf(this.model) + 1);
                return this;
            }
        });

        return UsersItemView;
    });