define([
    "text!templates/Workflows/CreateTemplate.html",
    "text!templates/Workflows/createList.html",
    "collections/RelatedStatuses/RelatedStatusesCollection",
    "models/WorkflowsModel"
],
    function (CreateTemplate, createList, RelatedStatusesCollection, WorkflowsModel) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Workflows",
            template: _.template(CreateTemplate),

            initialize: function (options) {
            	_.bindAll(this, "saveItem", "render");
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.render = _.after(1, this.render);
                this.relatedStatusesCollection = new RelatedStatusesCollection();
                this.relatedStatusesCollection.bind('reset', _.bind(this.render, this));
            },

            close: function () {
                this._modelBinder.unbind();
            },

            events: {
                "click .addStatus": "addNameStatus",
                "click button.remove": "removeNameStatus"
            },
            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            addNameStatus: function (e) {
                  e.preventDefault();
                  alert("Ura");
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
                    	self.hideDialog();
                        Backbone.history.navigate("easyErp/Workflows", { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("easyErp", { trigger: true });
                    }
                });
            },

            render: function () {
                var projectID = (window.location.hash).split('/')[3];
                var workflowsWIds = _.uniq(_.pluck(this.collection.toJSON(), 'wId'), false);
                model = projectID
                    ? {
                        project: {
                            _id: projectID
                        }
                    }
                    : null;
                var formString = this.template({ relatedStatusesCollection: this.relatedStatusesCollection, workflowsWIds: workflowsWIds });
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: "80%",
                    title: "Create Task",
                    buttons: {
                        save: {
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        }
                    }
                });

                $("#allNamesStatuses").append(_.template(createList, { relatedStatusesCollection: this.relatedStatusesCollection }));
                $("#allNamesStatuses .nameStatus:first-of-type button.remove").remove();
                return this;
            }

        });

        return CreateView;
    });