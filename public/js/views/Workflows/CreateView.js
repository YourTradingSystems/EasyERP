define([
    "text!templates/Workflows/CreateTemplate.html",
    "text!templates/Workflows/createList.html",
    "collections/RelatedStatuses/RelatedStatusesCollection",
    "models/WorkflowsModel",
    "common"
],
    function (CreateTemplate, createList, RelatedStatusesCollection, WorkflowsModel,common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Workflows",
            template: _.template(CreateTemplate),

            initialize: function (options) {         	
            	_.bindAll(this, "saveItem", "render");
            	this.collection = options.collection;
                this.relatedStatusesCollection = new RelatedStatusesCollection();
            	this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            events: {
                "click #addStatus": "addNameStatus",
                "click #removeStatus": "removeNameStatus"
            },
            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            addNameStatus: function (e) {
                  e.preventDefault();
                  $("#allNamesStatuses").append(_.template(createList, { relatedStatusesCollection: this.relatedStatusesCollection }));
             },
            removeNameStatus: function (e) {
            	e.preventDefault();
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
                    statuses.push($(this).find("#statusesDd option:selected").text());
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
                    	common.checkBackboneFragment("easyErp/Workflows", { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("easyErp", { trigger: true });
                    }
                });
            },

            render: function () {
            	var mid = 39;
                var workflowsWIds = _.uniq(_.pluck(this.collection.toJSON(), 'wId'), false);
                var formString = this.template({workflowsWIds: workflowsWIds});
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: "80%",
                    title: "Create Workflows",
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
                common.populateRelatedStatuses(App.ID.statusesDd, "/relatedStatus");
                
                return this;
            }

        });

        return CreateView;
    });