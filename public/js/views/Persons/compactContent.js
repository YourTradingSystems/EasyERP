define([
    "text!templates/Persons/compactContentTemplate.html",
    "common"
],
    function (compactContentTemplate, common) {
        var compactContentView = Backbone.View.extend({

            className: "form",

            events: {
                "click .inner scroll p > a": "gotoForm",
            },

            initialize: function () {
                
            },

            template: _.template(compactContentTemplate),

            render: function () {
                var collection = this.collection.toJSON();
                var company = this.model.toJSON();
                this.$el.html(this.template({
                    collection: collection,
                    company: company
                }));
                common.contentHolderHeightFixer();
                return this;
            }
        });

        return compactContentView;
    });