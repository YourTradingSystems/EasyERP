define([
    "text!templates/Projects/list/ListItemTemplate.html",
    'common'
],
    function (ListItemTemplate, common) {
        var ListItemView = Backbone.View.extend({
            tagName:"tr",

            initialize: function(){
                this.render();
            },

            events: {
                "click td:not(:has('input[type='checkbox']'))": "gotoForm"
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                //var itemIndex = $(e.target).closest("tr").data("index") + 1;
                var itemIndex = $(e.target).closest("tr").data("id");
                window.location.hash = "#home/content-Projects/form/" + itemIndex;
            },

            template: _.template(ListItemTemplate),

            render: function () {
                var index = this.model.collection.indexOf(this.model);
                this.$el.attr("data-index", index);
                this.$el.attr("data-id", this.model.id);
                this.$el.html(this.template(this.model.toJSON()));
                this.$("td:nth-child(2)").append(index + 1);
                common.contentHolderHeightFixer();
                return this;
            }
        });

        return ListItemView;
    });