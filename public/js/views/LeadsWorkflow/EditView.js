define([
    "text!templates/LeadsWorkflow/EditTemplate.html",
    "collections/LeadsWorkflow/LeadsWorkflowCollection",
    "collections/RelatedStatuses/RelatedStatusesCollection",
    "common",
    "custom"
],
    function (EditTemplate, LeadsWorkflowCollection, RelatedStatusesCollection, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Departments",

            initialize: function (options) {
                this.relatedStatusesCollection = new RelatedStatusesCollection();
                this.relatedStatusesCollection.bind('reset', _.bind(this.render, this));
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            saveItem: function () {

                var self = this;

                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var name = $.trim($("#name").val());

                    var statusId = this.$("#status option:selected").val();
                    var status = common.toObject(statusId, this.relatedStatusesCollection);

                    var sequence = this.collection.length;

                    currentModel.set({
                        name: name,
                        status: status,
                        sequence: sequence
                    });

                    currentModel.save({}, {
                        headers: {
                            mid: mid,
                            id: 'lead'
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
                    var currentModel = this.departmentsCollection.models[itemIndex];
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), relatedStatusesCollection: this.relatedStatusesCollection }));
                }
                common.contentHolderHeightFixer();
                return this;
            }

        });

        return EditView;
    });