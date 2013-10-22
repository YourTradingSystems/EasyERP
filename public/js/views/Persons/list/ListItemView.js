define([
    "text!templates/Persons/list/ListItemTemplate.html",
    'common'
],
    function (ListItemTemplate, common) {
        var ListItemView = Backbone.View.extend({
            tagName:"tr",

            initialize: function(){
                this.render();
            },

            template: _.template(ListItemTemplate),

            events: {
                "click td:not(:has('input[type='checkbox']'))": "gotoForm"
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = $(e.target).closest("tr").data("index") + 1;
                window.location.hash = "#home/content-Persons/form/" + itemIndex;
            },           

            render: function () {
                var index = this.model.collection.indexOf(this.model);
                this.$el.attr("data-index", index);
                this.$el.html(this.template(this.model.toJSON()));
                this.$("td:nth-child(2)").append(index + 1);
                common.contentHolderHeightFixer();
                return this;
            }
        });

        return ListItemView;
    });