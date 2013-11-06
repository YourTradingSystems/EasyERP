define([
    'text!templates/Leads/list/ListTemplate.html'
],

function (ListTemplate) {
    var LeadsListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = options.startNumber;
        },
        render: function() {
            this.$el.append(_.template(ListTemplate, { leadsCollection: this.collection.toJSON(), startNumber: this.startNumber }));
        },
    });

    return LeadsListItemView;
});
