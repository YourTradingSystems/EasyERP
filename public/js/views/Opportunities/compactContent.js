define([
    "text!templates/Opportunities/compactContentTemplate.html",
    "common"
],
    function (compactContentTemplate, common) {
        var compactContentView = Backbone.View.extend({

            className: "form",

            events: {
                "click #opportunities p > a": "gotoOpportunitieForm"
            },

            initialize: function () {
                //this.company = options.company;
            },

            template: _.template(compactContentTemplate),

            gotoOpportunitieForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest("a").attr("id");
                window.location.hash = "#home/content-Opportunities/form/" + itemIndex;
            },

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