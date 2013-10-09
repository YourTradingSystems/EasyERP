define([
    "text!templates/Companies/CreateTemplate.html",
    "collections/Companies/CompaniesCollection",
    "models/CompanyModel",
    "custom"
],
    function (CreateTemplate, CompaniesCollection, CompanyModel, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Companies",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.companyCollection = options.collection;
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                var companyModel = new CompanyModel();

                var name = $("#name").val();

                var email = $("#email").val();

                var phone = $("#phone").val();

                var mobile = $("#mobile").val();

                var fax = $("#fax").val();

                companyModel.save({
                    name: name,
                    email: email,
                    phones: {
                        phone: phone,
                        mobile: mobile,
                        fax: fax
                    },

                },
                    {
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

            },

            render: function () {
                this.$el.html(this.template);
                return this;
            }

        });

        return CreateView;
    });