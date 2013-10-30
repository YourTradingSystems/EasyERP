define(function () {
    var WorkflowModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var WorkflowsCollection = Backbone.Collection.extend({
        model: WorkflowModel,
        url: function () {
            var mid = 39,
                url = "/Workflows?mid=" + mid + "&id=lead";
            return url;
        },

        //type: "project",

        initialize: function () {
            console.log("Workflow Collection Init");
            this.fetch({
                type: 'GET',
                reset: true,
                success: this.fetchSuccess,
                error: this.fetchError
            });
        },

        parse: true,

        parse: function (response) {
            return response.data.value;
        },

        fetchSuccess: function (collection, response) {
            console.log("Workflows fetchSuccess");
        },
        fetchError: function (error) {

        }

    });

    return WorkflowsCollection;
});