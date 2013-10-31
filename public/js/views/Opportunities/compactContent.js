define([
    "text!templates/Opportunities/compactContentTemplate.html",
    "common"
],
    function (compactContentTemplate, common) {
        var compactContentView = Backbone.View.extend({

            className: "form",

            initialize: function () {
            },

            events: {
                "click #opportunities p > a": "gotoOpportunitieForm"
            },

            template: _.template(compactContentTemplate),

            gotoOpportunitieForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest("a").attr("id");
                window.location.hash = "#home/content-Opportunities/form/" + itemIndex;
            },

            render: function (options) {
                if (options) {
                    var company = this.model.get("company");
                } else {
                    company = this.model.toJSON();
                }
                this.$el.html(this.template({
                    collection: this.collection.toJSON(),
                    company: company
                }));
                common.contentHolderHeightFixer();
                return this;
            }
        });

        return compactContentView;
    });