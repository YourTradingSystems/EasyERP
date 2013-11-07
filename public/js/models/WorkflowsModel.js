define(function () {
    var WorkflowsModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            wId: '',
            name: '',
            value: []
        },

        urlRoot: function () {
            return "/Workflows";
        }
    });

    return WorkflowsModel;
});