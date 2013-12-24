define([
    'text!templates/Persons/list/ListTemplate.html'
],

function (ListTemplate) {
    var PersonsListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = options.startNumber;
        },
        render: function() {
            this.$el.append(_.template(ListTemplate, { personsCollection: this.collection.toJSON(), startNumber: this.startNumber }));
        }
    });

    return PersonsListItemView;
});
