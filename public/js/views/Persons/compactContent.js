define([
    "text!templates/Persons/compactContentTemplate.html",
    "common"
],
    function (compactContentTemplate, common) {
        var compactContentView = Backbone.View.extend({

            className: "form",

            events: {
                "click #persons p > a": "gotoPersonsForm"
            },

            initialize: function (options) {
                
            },

            template: _.template(compactContentTemplate),

            gotoPersonsForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest("a").attr("id");
                window.location.hash = "#easyErp/Persons/form/" + itemIndex;
            },

            render: function (options) {
                this.$el.html(this.template({
                    collection: this.collection,
					options: options
                }));
                return this;
            }
        });

        return compactContentView;
    });
