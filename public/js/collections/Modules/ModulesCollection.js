define(function () {
    var MenuItems = Backbone.Collection.extend({

        url: function () {
            return "/getModules"
        },
        initialize: function () {
            this.fetch({
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
        },
        fetchError: function (error) {
        }
    });

    return MenuItems;
});