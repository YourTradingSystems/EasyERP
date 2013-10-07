define([
    "text!templates/SourceOfApplicants/CreateTemplate.html",
    "collections/SourceOfApplicants/SourceOfApplicantsCollection",
    "models/SourceOfApplicantsModel",
    "custom"
],
    function (CreateTemplate, SourceOfApplicantsCollection, SourceOfApplicantsModel, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Source Of Applicants",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = options.collection;
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {

                var mid = 39;

                var sourceOfApplicantsModel = new SourceOfApplicantsModel();

                var name = $.trim($("#name").val());

                sourceOfApplicantsModel.save({
                   name:name
                },
                {
                    headers: {
                        mid: mid
                    }
                });

                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });

            },

            render: function () {
                this.$el.html(this.template());
                return this;
            }

        });

        return CreateView;
    });