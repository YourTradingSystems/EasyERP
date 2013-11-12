define([
    "collections/Projects/ProjectsDdCollection"
],
    function (ProjectsDdCollection) {
        var ProjectsDdView = Backbone.View.extend({
            el: "select#projectDd",
            template : _.template("<option value='<%= model._id%>' ><%= model.projectName %> </option>"),
            initialize: function () {
                this.collection = new ProjectsDdCollection();
                this.collection.bind("reset", _.bind(this.render,this));
            },

            render: function () {
                var self = this;
                _.each(this.collection.toJSON(), function(model){
                    self.$el.append(self.template({model:model}));
                });
                return this;
            }
        });

        return ProjectsDdView;
    });
