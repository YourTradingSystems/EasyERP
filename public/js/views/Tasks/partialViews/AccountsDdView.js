define([
    "collections/Customers/AccountsDdCollection"
],
    function (AccountsDdCollection) {
        var AccountsDdView = Backbone.View.extend({
            el: "select#assignedToDd",
            template : _.template("<option value='<%= model._id%>' ><%= model.name.first %> <%= model.name.last %></option>"),
            initialize: function () {
                this.collection = new AccountsDdCollection();
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

        return AccountsDdView;
    });