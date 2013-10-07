define(function () {
    var WorkflowModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var WorkflowsCollection = Backbone.Collection.extend({
        model: WorkflowModel,
        url: function () {
            var mid = 39,
                url = "/Workflows?mid=" + mid + "&id=" + this.type;
            return url;
        },

        //type: "project",

        initialize: function (options) {
            console.log("Workflow Collection Init");
            this.type = options.id;
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
            /*if (options.success) {
                options.success(result);
            }*/
        },
        fetchError: function (error) {

        }

    });

    return WorkflowsCollection;
});