define([
    "text!templates/Opportunities/compactContentTemplate.html",
    "common"
],
    function (compactContentTemplate, common) {
        var compactContentView = Backbone.View.extend({

            className: "form",

            initialize: function () {
                //this.company = options.company;
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