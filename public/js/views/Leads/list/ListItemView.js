define([
    "text!templates/Leads/list/ListItemTemplate.html"
],
    function (ListItemTemplate) {
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
                var itemIndex = $(e.target).closest("tr").data("index") + 1;
                window.location.hash = "#home/content-Leads/form/" + itemIndex;
            },

            template: _.template(ListItemTemplate),

            render: function () {
                var model = this.model;
                var index = model.collection.indexOf(model);
                model.set({ creationDate: model.get("creationDate").split('.')[0].replace(/T|Z/g, ' ').replace(/-/g, '/') });
                this.$el.attr("data-index", index);
                this.$el.html(this.template(model.toJSON()));
                this.$("td:nth-child(2)").append(index + 1);
                return this;
            }
        });

        return ListItemView;
    });