define([
    'text!templates/Applications/list/ListTemplate.html',
    "common",
    'text!templates/stages.html'
],

function (ApplicationsListTemplate,common, stagesTamplate) {
    var ApplicationsListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = options.startNumber;
        },
        events: {
        },

         render: function() {
             this.$el.append(_.template(ApplicationsListTemplate, { applicationsCollection: this.collection.toJSON(), startNumber: this.startNumber }));

         }
    });

    return ApplicationsListItemView;
});
