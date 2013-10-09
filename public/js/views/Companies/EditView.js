define([
    "text!templates/Companies/EditTemplate.html",
    "collections/Companies/CompaniesCollection",
    "custom"
],
    function (EditTemplate, CompaniesCollection, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Companies",

            initialize: function (options) {
                this.companiesCollection = options.collection;

                this.render();
            },

            saveItem: function () {
                var self = this;
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var name = $("#name").val();

                    var email = $("#email").val();

                    var phone = $("#phone").val();

                    var mobile = $("#mobile").val();

                    var fax = $("#fax").val();

                    currentModel.set({
                        name: name,
                        email: email,
                        phones: {
                            phone: phone,
                            mobile: mobile,
                            fax: fax
                        },
                    });

                    currentModel.save({}, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });
                }

            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.companiesCollection.models[itemIndex];
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON() }));
                }

                return this;
            }

        });

        return EditView;
    });