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

        initialize: function (options) {
            if (!options) {
                this.type = "";
            } else {
                this.type = options.id;
            }
            this.fetch({
                type: 'GET',
                reset: true,
                success: this.fetchSuccess,
                error: this.fetchError
            });
        },

        parse: true,

        parse: function (response) {
            return response.data;
        },

        fetchSuccess: function (collection, response) {
            console.log("Workflows fetchSuccess");
        },
        fetchError: function (error) {

        }

    });

    return WorkflowsCollection;
});