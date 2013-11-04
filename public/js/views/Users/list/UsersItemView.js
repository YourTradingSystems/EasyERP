define([
    "text!templates/Users/list/UsersItemTemplate.html",
    'common'
],
    function (UsersItemTemplate, common) {
        var UsersItemView = Backbone.View.extend({
            tagName:"tr",

            events: {
                "click td:not(:has('input[type='checkbox']'))": "gotoForm"
            },

            initialize: function(){
                this.render();
            },

            template: _.template(UsersItemTemplate),

            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = this.$el.data("index") + 1;
                window.location.hash = "#home/content-Users/form/" + itemIndex;
            },

            render: function () {
                this.$el.attr("data-index", this.model.collection.indexOf(this.model));
                this.$el.attr("id", this.model.get('_id'));
                this.$el.html(this.template(this.model.toJSON()));
                this.$("td:nth-child(2)").append(this.model.collection.indexOf(this.model) + 1);
                return this;
            }
        });

        return UsersItemView;
    });