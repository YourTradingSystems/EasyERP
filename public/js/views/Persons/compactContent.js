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

            initialize: function () {
                
            },

            template: _.template(compactContentTemplate),

            gotoPersonsForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest("a").attr("id");
                window.location.hash = "#home/content-Persons/form/" + itemIndex;
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