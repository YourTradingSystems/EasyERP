define(function () {
    var LeadsWorkflowModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            name: 'Lead workflow',
            status: 'New' ,
            sequence: 0 
        },

        urlRoot: function () {
            return "/Workflows";
        }
    });

    return LeadsWorkflowModel;
});