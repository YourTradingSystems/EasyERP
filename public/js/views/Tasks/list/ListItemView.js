define([
    "text!templates/Tasks/list/ListItemTemplate.html",
    'common'
],
    function (TasksItemTemplate, common) {

        var TasksItemView = Backbone.View.extend({
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
                window.location.hash = "#home/content-Tasks/form/" + itemIndex;
            },

            template: _.template(TasksItemTemplate),

            render: function () {

                var extrainfo = this.model.get('extrainfo');
                extrainfo['StartDate'] = (this.model.get('extrainfo').StartDate) ? common.ISODateToDate(this.model.get('extrainfo').StartDate) : '';
                extrainfo['EndDate'] = (this.model.get('extrainfo').EndDate) ? common.ISODateToDate(this.model.get('extrainfo').EndDate) : '';
                this.model.set({ extrainfo: extrainfo }, { silent: true });

                var index = this.model.collection.indexOf(this.model);
                this.$el.attr("data-index", index);
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return TasksItemView;
    });