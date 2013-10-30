define([
    "text!templates/Opportunities/compactContentTemplate.html",
    'collections/Companies/CompaniesCollection',
    "common"
],
    function (compactContentTemplate, CompaniesCollection, common) {
        var compactContentView = Backbone.View.extend({

            className: "form",

            initialize: function () {
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));
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
                var collection = this.collection.toJSON();
                if (options) {
                    var company = this.companiesCollection.get(this.model.get("company").id);
                } else {
                    company = this.model.toJSON();
                }
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