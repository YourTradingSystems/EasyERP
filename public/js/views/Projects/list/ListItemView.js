define([
    'text!templates/Projects/list/ListTemplate.html'
],

function (ProjectsListTemplate) {
    var ProjectsListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = options.startNumber;
        },
        render: function() {
            this.$el.append(_.template(ProjectsListTemplate, { projectsCollection: this.collection.toJSON(), startNumber: this.startNumber }));
        }
    });

    return ProjectsListItemView;
});
