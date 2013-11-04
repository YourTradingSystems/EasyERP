define([
    "text!templates/SourceOfApplicants/EditTemplate.html",
    "collections/SourceOfApplicants/SourceOfApplicantsCollection",
    "custom",
    "common"
],
    function (EditTemplate, SourceOfApplicantsCollection, Custom, common) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Source Of Applicants",

            initialize: function (options) {
                this.departmentsCollection = options.collection;
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            saveItem: function () {

                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var name = $.trim($("#name").val());

                    currentModel.set({
                       name:name
                    });

                    currentModel.save({}, {
                        headers: {
                            mid: mid
                        }
                    });

                    Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
                }

            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.departmentsCollection.models[itemIndex];
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON() }));
                }
                return this;
            }

        });

        return EditView;
    });