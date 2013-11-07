define(function () {
    var LeadsWorkflowModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            wId: '',
            name: '',
            value: [
                {
                    name: '',
                    status: '',
                    sequence: 0
                }
            ]
        },

        urlRoot: function () {
            return "/Workflows";
        }
    });

    return LeadsWorkflowModel;
});