define(function () {
    var relatedStatusModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var relatedStatusesCollection = Backbone.Collection.extend({
        model: relatedStatusModel,
        url: function () {
            var mid = 39,
                url = "/relatedStatus?mid=" + mid;
            return url;
        },

        initialize: function (options) {
            console.log("RelatedStatuses Collection Init");
            this.fetch({
                type: (options && options.type) ? options.type : '',
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
            console.log("RelatedStatuses fetchSuccess");
        },
        fetchError: function (error) {

        }

    });

    return relatedStatusesCollection;
});