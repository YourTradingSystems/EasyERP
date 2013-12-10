define([
    'text!templates/Profiles/list/ListTemplate.html'
],

function (ListTemplate) {
    var ListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
        },

        render: function() {
            this.$el.append(_.template(ListTemplate,
                { usersCollection: this.collection.toJSON()}));
        }
    });

    return ListItemView;
});
