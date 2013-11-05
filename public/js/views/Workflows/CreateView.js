define([
    "text!templates/Workflows/CreateTemplate.html",
    "collections/Workflows/WorkflowsCollection",
    "collections/RelatedStatuses/RelatedStatusesCollection",
    "models/WorkflowsModel",
    "common",
    "custom"
],
    function (CreateTemplate, WorkflowsCollection, RelatedStatusesCollection, WorkflowsModel, common, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "LeadsWorkflow",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.relatedStatusesCollection = new RelatedStatusesCollection();
                this.relatedStatusesCollection.bind('reset', _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.leadsWorkflowCollection = options.collection;
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {

                var self = this;

                var mid = 39;

                var leadsWorkflowModel = new LeadsWorkflowModel();

                var name = $.trim($("#name").val());

                var statusId = this.$("#status option:selected").val();
                var status = common.toObject(statusId, this.relatedStatusesCollection);

                var sequence = this.collection.length;

                leadsWorkflowModel.save({
                    name: name,
                    status: status,
                    sequence: sequence
                },
                {
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
            },

            render: function () {
                this.$el.html(this.template({ relatedStatusesCollection: this.relatedStatusesCollection }));
                return this;
            }

        });

        return CreateView;
    });