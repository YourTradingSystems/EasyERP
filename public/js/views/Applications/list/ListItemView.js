define([
    'text!templates/Applications/list/ListTemplate.html'
],

function (ApplicationsListTemplate) {
    var ApplicationsListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = options.startNumber;
        },
        render: function() {
            this.$el.append(_.template(ApplicationsListTemplate, { applicationsCollection: this.collection.toJSON(), startNumber: this.startNumber }));
        }
    });

    return ApplicationsListItemView;
});
