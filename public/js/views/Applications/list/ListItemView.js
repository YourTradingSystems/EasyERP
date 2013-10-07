define([
    "text!templates/Applications/list/ListItemTemplate.html",
    'custom'
],
    function (ApplicationsItemTemplate, Custom) {

        var ApplicationsItemView = Backbone.View.extend({
            tagName: "tr",

            initialize: function () {
                this.render();
            },

            events: {
                "click td:not(:has('input[type='checkbox']'))": "gotoForm"
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = $(e.target).closest("tr").data("index") + 1;
                window.location.hash = "#home/content-Applications/form/" + itemIndex;
            },

            template: _.template(ApplicationsItemTemplate),

            render: function () {
                var model = this.model;
                var index = model.collection.indexOf(model);
                model.set({ creationDate: model.get("creationDate").split('.')[0].replace(/T|Z/g, ' ').replace(/-/g,'/') });
                this.$el.attr("data-index", index);
                this.$el.html(this.template(model.toJSON()));
                return this;
            }
        });

        return ApplicationsItemView;
    });