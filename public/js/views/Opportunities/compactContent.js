define([
    "text!templates/Opportunities/compactContentTemplate.html",
    "common"
],
    function (compactContentTemplate, common) {
        var compactContentView = Backbone.View.extend({

            className: "form",

            initialize: function (options) {
            	this.personsCollection = (options && options.personsCollection) ? options.personsCollection : null;
            },

            events: {
                "click #opportunities p > a": "gotoOpportunitieForm"
            },

            template: _.template(compactContentTemplate),

            gotoOpportunitieForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest("a").attr("id");
                window.location.hash = "#easyErp/Opportunities/form/" + itemIndex;
            },

            render: function (options) {
                if (options) {
                	var company = this.model.toJSON();
                	var personsCollection = null;
                } else {
                    company = this.model.toJSON();
                    personsCollection = this.personsCollection.toJSON();
                }
                this.$el.html(this.template({
                    collection: this.collection.toJSON(),
                    company: company,
                    personsCollection:personsCollection
                }));
                return this;
                
            }
        });

        return compactContentView;
    });