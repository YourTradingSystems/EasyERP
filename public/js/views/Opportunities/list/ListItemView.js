define([
    'text!templates/Opportunities/list/ListTemplate.html'
],

function (OpportunitiesListTemplate) {
    var OpportunitiesListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = options.startNumber;
        },
        render: function() {
            this.$el.append(_.template(OpportunitiesListTemplate, { opportunitiesCollection: this.collection.toJSON(), startNumber: this.startNumber }));
        },
    });

    return OpportunitiesListItemView;
});
