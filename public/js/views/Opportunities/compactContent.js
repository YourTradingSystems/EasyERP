define([
    "text!templates/Opportunities/compactContentTemplate.html"
],
    function (compactContentTemplate) {
        var compactContentView = Backbone.View.extend({
			className:"form",

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
				console.log(this.collection);
                this.$el.html(this.template({
                    collection: this.collection,
					options: options
                }));
                return this;
                
            }
        });

        return compactContentView;
    });
