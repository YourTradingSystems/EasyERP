define([
    "text!templates/Workflows/CreateTemplate.html",
    "text!templates/Workflows/createList.html",
    "collections/RelatedStatuses/RelatedStatusesCollection",
    "models/WorkflowsModel",
    "common",
    "custom"
],
    function (CreateTemplate, createList, RelatedStatusesCollection, WorkflowsModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Workflows",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.relatedStatusesCollection = new RelatedStatusesCollection();
                this.relatedStatusesCollection.bind('reset', _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.collection = options.collection;
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            events: {
                "click button#add": "addNameStatus",
                "click button.remove": "removeNameStatus"
            },

            addNameStatus: function (e) {
                e.preventDefault();
                $("#allNamesStatuses").append(_.template(createList, { relatedStatusesCollection: this.relatedStatusesCollection }));
            },

            removeNameStatus: function (e) {
                $(e.target).closest(".nameStatus").remove();
            },

            saveItem: function () {

                var self = this;

                var mid = 39;

                var workflowsModel = new WorkflowsModel();

                var wId = this.$("#wId option:selected").val();

                var name = $.trim($("#workflowsName").val());

                var value = [];
                var names = [],
                    statuses = [];
                this.$(".nameStatus").each(function () {
                    names.push($(this).find(".name").val());
                    statuses.push($(this).find(".status option:selected").text());
                });

                for (var i = 0; i < names.length; i++) {
                    value.push({ name: names[i], status: statuses[i], sequence: i });
                }

                workflowsModel.save({
                    wId: wId,
                    name: name,
                    value: value
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
                var workflowsWIds = _.uniq(_.pluck(this.collection.toJSON(), 'wId'), false);
                this.$el.html(this.template({ relatedStatusesCollection: this.relatedStatusesCollection, workflowsWIds: workflowsWIds }));
                return this;
            }

        });

        return CreateView;
    });