define([
    "text!templates/Workflows/EditTemplate.html",
    "text!templates/Workflows/editList.html",
    "text!templates/Workflows/createList.html",
    "text!templates/Workflows/selectTemplate.html",
    "collections/Workflows/WorkflowsCollection",
    "collections/RelatedStatuses/RelatedStatusesCollection",
    "common",
    "custom"
],
    function (EditTemplate, editList, createList, selectTemplate, WorkflowsCollection, RelatedStatusesCollection, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Workflows",

            initialize: function (options) {
                this.relatedStatusesCollection = new RelatedStatusesCollection();
                this.relatedStatusesCollection.bind('reset', _.bind(this.render, this));
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.render = _.after(1, this.render);
            },

            events: {
                "click button#add": "addNameStatus",
                "click button.remove": "removeNameStatus",
                "change #wId": "changeWNames",
                "change #workflowsName": "changeDetails"
            },

            changeWNames: function (e) {
                if (!e) {
                    var wId = "Opportunity";
                } else {
                    wId = this.$("#wId option:selected").val();
                }
                $("#selectWNames").html(_.template(selectTemplate, { workflowsNames: this.getWorkflowNames(wId) }));
                this.changeDetails(this.getWorkflowNames(wId)[0]);
            },

            getWorkflowNames: function (wId) {
                var names = [];
                _.each(this.collection.models, function (model) {
                    if (model.get('wId') == wId) {
                        names.push(model.get('name'));
                    }
                }, this);
                return names;
            },

            changeDetails: function (name) {
                $("#allNamesStatuses").html("");
                if (typeof name != "string") {
                    name = this.$("#selectWNames option:selected").val();
                }
                var model = this.collection.findWhere({ name: name }).toJSON();
                for (var i = 0; i < model.value.length; i++) {
                    $("#allNamesStatuses").append(_.template(editList, { value: model.value[i], relatedStatusesCollection: this.relatedStatusesCollection }));
                }

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

                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var wId = this.$("#wId option:selected").val();

                    var name = this.$("#workflowsName option:selected").val();

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

                    currentModel.set({
                        wId: wId,
                        name: name,
                        value: value
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
                var workflowsWIds = _.uniq(_.pluck(this.collection.toJSON(), 'wId'), false);
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.collection.models[itemIndex];
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), relatedStatusesCollection: this.relatedStatusesCollection, workflowsWIds: workflowsWIds, workflowsCollection: this.collection }));
                }
                for (var i = 0; i < currentModel.get("value").length; i++) {
                    $("#allNamesStatuses").append(_.template(editList, { value: currentModel.get("value")[i], relatedStatusesCollection: this.relatedStatusesCollection }));
                }
                $("#selectWNames").html(_.template(selectTemplate, { workflowsNames: this.getWorkflowNames("Opportunity") }));
                $("#allNamesStatuses .nameStatus:first-of-type button.remove").remove();
                return this;
            }

        });

        return EditView;
    });