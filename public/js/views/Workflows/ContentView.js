define([
    'text!templates/Workflows/list/ListTemplate.html',
    'views/Workflows/list/ListItemView',
    'text!templates/Workflows/form/FormTemplate.html',
    'collections/RelatedStatuses/RelatedStatusesCollection',
    'custom'
],
function (ListTemplate, ListItemView, FormTemplate, RelatedStatusesCollection, Custom) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            this.relatedStatusesCollection = new RelatedStatusesCollection();
            this.relatedStatusesCollection.bind('reset', _.bind(this.render, this));
            console.log('Init Workflows View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
            "click .checkbox": "checked",
            //"click td:not(:has('input[type='checkbox']'))": "gotoForm",
            "click a.workflow": "chooseWorkflowNames",
            "click .workflow-sub-list li": "chooseWorkflowDetailes",
            "click .workflow-list li": "chooseWorkflowNames",
            "click #workflowNames div.cathegory a": "chooseWorkflowDetailes",
            "click #workflowSubNames div.cathegory a": "chooseWorkflowDetailes",
            "click #workflowNames span": "chooseWorkflowDetailes",
            "click td .edit": "edit",
            "click a:contains('Cancel')": "cancel",
            "click a:contains('Save')": "save"
        },

        save: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var name = tr.find("td.name input").val();
            var status = tr.find("td.status option:selected").text();
            var tdName = tr.find("td.name");
            var id = tdName.data("id");
            var sequence = tdName.data("sequence");
            var model = this.collection.get(id);
            this.collection.url = "/Workflows";
            var obj = {
                name: name,
                status: status,
                sequence: sequence
            };
            console.log(obj);
            model.set(obj);
            model.save({}, {
                headers: {
                    mid: 39
                },
                success: function () {
                    Backbone.history.navigate("#home/content-Workflows", { trigger: true });
                }
            });
        },

        cancel: function (e) {
            e.preventDefault();
            var targetParent = $(e.target).parent();
            targetParent.siblings().find("span").removeClass("hidden").end().find("input, select, a:contains('Cancel'), a:contains('Save')").remove();
            targetParent.find(".edit").removeClass("hidden").end().find("a:contains('Cancel'), a:contains('Save')").remove();
        },

        edit: function (e) {
            e.preventDefault();
            var target = $(e.target);
            var td = target.parent();
            var text = "<a href='#'>";
            var select = $("<select/>");
            target.closest("tr").find("span, .edit").addClass("hidden");
            td.siblings(".status").append(select);
            var statusText = td.siblings("td.status").text();
            this.relatedStatusesCollection.forEach(function (status) {
                var statusJson = status.toJSON();
                (statusJson.status == statusText) ?
                    select.append($("<option>").text(statusJson.status).attr('selected', 'selected')) :
                    select.append($("<option>").text(statusJson.status));
            });

            td.siblings(".name").append(
                $("<input>").val(td.siblings("td.name").text()));
            td.append(
                $(text).text("Save"),
                $(text).text("Cancel")
            );
        },

        gotoForm: function (e) {
            App.ownContentType = true;
            var itemIndex = $(e.target).closest("tr").data("index") + 1;
            window.location.hash = "#home/content-Workflows/form/" + itemIndex;
        },

        chooseSubWorkflowNames: function (e) {
            alert($(e.target).hasClass("workflow-sub"));

        },
        chooseWorkflowNames: function (e) {
            this.$(".workflow-sub-list>*").remove();
            this.$("#details").addClass("active").show();
            this.$("#workflows").empty();
            this.$("#workflowNames").html("");
            $(e.target).parents(".workflow-list").find(".active").removeClass("active");
            var wId = "";
            if ($(e.target).hasClass("workflow")) {
                $(e.target).parent().addClass("active");
                wId = $(e.target).text();
            } else {
                $(e.target).addClass("active");
                wId = $(e.target).find("a").text();

            }
            var names = [], wName;
            _.each(this.collection.models, function (model) {
                if (model.get('wId') == wId && wName != model.get('wName')) {
                    names.push(model.get('wName'));
                    wName = model.get('wName');
                }
            }, this);

            var first = false;
            _.each(names, function (name) {
                if (first) {
                    this.$(".workflow-sub-list").append("<li class='active'><a class='workflow-sub' data-id='" + name + "'href='javascript:;'>" + name + "</a></li>");
                    first = false;
                }
                else {
                    this.$(".workflow-sub-list").append("<li data-id='" + name + "'><a class='workflow-sub' data-id='" + name + "'href='javascript:;'>" + name + "</a></li>");
                }
                //this.$("#sub-details").html("");
            }, this);
        },
        chooseWorkflowDetailes: function (e) {
            $(e.target).parents(".workflow-sub-list").find(".active").removeClass("active");
            if ($(e.target).hasClass("workflow-sub")) {
                $(e.target).parent().addClass("active");
            } else {
                $(e.target).addClass("active");
            }
            //this.$("#sub-details").html("");
            var name = $(e.target).data("id");
            var nameDetails = this.$("#sub-details").attr("data-id");
            if (name == nameDetails && this.$("#sub-details").hasClass("active")) {
                this.$("#details").hide(150, function () {
                    $(this).removeClass("active");
                })
                return;
            }
            else {
                this.$("#details").show(150, function () {
                    $(this).addClass("active");
                })
            }
            var values = [];
            _.each(this.collection.models, function (model) {
                if (model.get('wName') == name) {
                    console.log(model);
                    values.push({ id: model.get("_id"), name: model.get('name'), status: model.get('status'), sequence: model.get('sequence'), color: model.get('color') });
                    console.log(values);
                }
            }, this);
            this.$("#sub-details").attr("data-id", name).find("#workflows").empty().append($("<thead />").append(
               $("<tr />").append($("<th />").text("Name"), $("<th />").text("Status"))), $("<tbody/>"));
            _.each(values, function (value) {
                this.$("#sub-details tbody").append(new ListItemView({ model: value }).render().el);
            }, this);
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Workflows View');
            var workflowsWIds = _.uniq(_.pluck(this.collection.toJSON(), 'wId'), false);
            this.$el.html(_.template(ListTemplate, { workflowsWIds: workflowsWIds }));
            return this;
        },

        checked: function () {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteItems: function () {
            var self = this,
                mid = 39,
                model;

            $.each($("tbody input:checked"), function (index, checkbox) {
                model = self.collection.get(checkbox.value);
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
            });
            this.collection.trigger('reset');
        }
    });

    return ContentView;
});
