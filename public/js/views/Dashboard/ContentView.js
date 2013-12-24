define([
    "text!templates/Dashboard/DashboardTemplate.html"
],
    function (DashboardTemplate) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "Dashboard",
            actionType:"Content",
            template: _.template(DashboardTemplate),
            initialize: function () {
                this.render();
            },
            events:{

            },

            render: function () {
                this.$el.html(this.template());

                return this;
            }
        });

        return ContentView;
    });
