define([
    'text!templates/Workflows/list/ListTemplate.html',
    'views/Workflows/list/ListItemView',
    'text!templates/Workflows/form/FormTemplate.html',
    'custom'
],
function (ListTemplate, ListItemView, FormTemplate, Custom) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Workflows View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
            "click .checkbox": "checked",
            "click td:not(:has('input[type='checkbox']'))": "gotoForm",
            "click a.workflow": "chooseWorkflowNames",
            "click #workflowNames p": "chooseWorkflowDetailes"
        },
        gotoForm: function (e) {
            App.ownContentType = true;
            var itemIndex = $(e.target).closest("tr").data("index") + 1;
            window.location.hash = "#home/content-Workflows/form/" + itemIndex;
        },

        chooseWorkflowNames: function (e) {
            this.$("#workflowNames").html("");
            var wId = $(e.target).text();
            var names = [];
            _.each(this.collection.models, function (model) {
                if (model.get('wId') == wId) {
                    names.push(model.get('name'));
                }
            }, this);
            _.each(names, function (name) {
                this.$("#workflowNames").append("<p data-id='" + name + "'>" + name + "</p>");
                this.$("#details").html("");
            }, this);
        },

        chooseWorkflowDetailes: function (e) {
            this.$("#details").html("");
            var name = $(e.target).data("id");
            var values;
            _.each(this.collection.models, function (model) {
                if (model.get('name') == name) {
                    console.log(model);
                    values = model.get('value');
                }
            }, this);
            _.each(values, function (value) {
                this.$("#details").append(new ListItemView({ model: value }).render().el);
            }, this);
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Workflows View');
            var workflowsWIds = _.uniq(_.pluck(this.collection.toJSON(), 'wId'), false);
            this.$el.html(_.template(ListTemplate, { workflowsWIds: workflowsWIds }));
            return this;
        },

        checked: function () {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteItems: function () {
            var self = this,
                mid = 39,
                model;

            $.each($("tbody input:checked"), function (index, checkbox) {
                model = self.collection.get(checkbox.value);
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
            });

            this.collection.trigger('reset');

        }

    });

    return ContentView;
});
