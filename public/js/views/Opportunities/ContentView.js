define([
    'text!templates/Opportunities/list/ListTemplate.html',
    'text!templates/Opportunities/form/FormTemplate.html',
    'text!templates/Opportunities/kanban/WorkflowsTemplate.html',
    'collections/Workflows/WorkflowsCollection',
    'views/Opportunities/kanban/KanbanItemView',
    'custom',
    'common',
    'views/Opportunities/EditView',
    'views/Opportunities/CreateView'
],

function (ListTemplate, FormTemplate, WorkflowsTemplate, WorkflowsCollection, OpportunitiesKanbanItemView, Custom, common, EditView, CreateView) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Opportunities View');
            var that = this;
            this.workflowsCollection = new WorkflowsCollection({ id: 'Opportunity' });
            this.workflowsCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
        },

        events: {
            "click .checkbox": "checked",
            "click .breadcrumb a, #lost, #won": "changeWorkflow",
            "click #hire": "isEmployee",
            "click #tabList a": "switchTab",
            "click .list td:not(:has('input[type='checkbox']'))": "gotoForm"
        },

        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).closest("tr").attr("id");
            window.location.hash = "#home/content-Opportunities/form/" + id;
        },

        switchTab: function (e) {
            e.preventDefault();
            var link = this.$("#tabList a");
            if (link.hasClass("selected")) {
                link.removeClass("selected");
            }
            var index = link.index($(e.target).addClass("selected"));
            this.$(".tab").hide().eq(index).show();
        },

        render: function () {
            var that = this;
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Opportunities View');
            var viewType = Custom.getCurrentVT();
            var mid = 39;
            var models = [];
            var workflows = this.workflowsCollection.toJSON();
            var opportunitieId = window.location.hash.split('/')[3];
            if (!opportunitieId || opportunitieId.length < 24) {
                models = this.collection.models;
                App.hash = null;
            }
            else {
                App.hash = opportunitieId;
                _.each(this.collection.models, function (item) {
                    if (item.get("id") == opportunitieId) models.push(item);
                }, this);
            }
            switch (viewType) {
                case "kanban":
                    {
                        this.$el.html(_.template(WorkflowsTemplate, { workflowsCollection: workflows }));
                        $(".column").last().addClass("lastColumn");
                        _.each(workflows, function (workflow, i) {
                            var counter = 0,
                                revenue = 0;
                            var column = this.$(".column").eq(i);
                            _.each(models, function (model) {
                                if (model.get("workflow").name === column.data("name")) {
                                    opportunitieItemView = new OpportunitiesKanbanItemView({ model: model });
                                    opportunitieItemView.bind('deleteEvent', this.deleteItems, opportunitieItemView);
                                    column.append(opportunitieItemView.render().el);
                                    counter++;
                                    revenue += model.get("expectedRevenue").value;
                                }
                            }, this);
                            var count = " <span>(<span class='counter'>" + counter + "</span>)</span>";
                            var content = "<p class='revenue'>Expected Revenue: <span>" + revenue + "</span></p>";
                            column.find(".columnNameDiv h2").append(count);
                            column.find(".columnNameDiv").append(content);
                        }, this);
                        break;
                    }
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate, { opportunitiesCollection: this.collection.toJSON() }));

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });

                        break;
                    }
                case "form":
                    {
                        var currentModel = this.collection.getElement();
                        if (!currentModel) {
                            this.$el.html('<h2>No Application found</h2>');
                        } else {
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                        }
                        break;
                    }
            }

            this.$(".column").sortable({
                connectWith: ".column",
                cancel: "h2",
                cursor: "move",
                items: ".item",
                opacity: 0.7,
                revert: true,
                helper: 'clone',
                start: function (event, ui) {
                    var column = ui.item.closest(".column");
                    var model = that.collection.get(ui.item.attr("id"));
                    column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                    column.find(".revenue span").html(parseInt(column.find(".revenue span").html()) - (model.get("expectedRevenue").value));
                },
                stop: function (event, ui) {
                    var model = that.collection.get(ui.item.attr("id"));
                    var column = ui.item.closest(".column");
                    var ob = {
                        workflow: column.data("id")
                    };

                    model.set(ob);
                    model.save({}, {
                        headers: {
                            mid: mid
                        }

                    });
                    column.find(".counter").html(parseInt(column.find(".counter").html()) + 1);
                    column.find(".revenue span").html(parseInt(column.find(".revenue span").html()) + (model.get("expectedRevenue").value));
                }
            }).disableSelection();
            return this;
        },

        editItem: function () {
            //create editView in dialog here
            new EditView({ collection: this.collection });
        },

        createItem: function () {
            new CreateView();
        },

        changeWorkflow: function (e) {
            var mid = 39;
            var name = '', status = '';
            var length = this.workflowsCollection.length;
            var workflow = {};
            if ($(e.target).attr("id") == "won") {
                workflow = this.workflowsCollection.models[length - 2];
            }
            else {
                workflow = this.workflowsCollection.models[length - 1];
            }
            name = workflow.get('name');
            status = workflow.get('status');
            var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
            var ob = {
                workflow: {
                    name: name,
                    status: status
                }
            };

            model.set(ob);
            model.save({}, {
                headers: {
                    mid: mid
                }
            });
        },

        isEmployee: function (e) {
            var mid = 39;
            var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
            model.set({ isEmployee: true });
            model.save({}, {
                headers: {
                    mid: mid
                }

            });
        },

        openDropDown: function (e) {
            e.preventDefault();
            var foldUnfold = "Unfold";
            if (!$(e.target).closest(".column").hasClass("rotate")) {
                foldUnfold = "Fold";
                $(e.target).closest(".columnNameDiv").toggleClass("selected");
            }
            $(e.target).closest(".foldUnfold").siblings(".dropDownMenu").html("<li><a class='fold' href='#'>" + foldUnfold + "</a></li>").fadeToggle("normal");
        },

        foldUnfoldColumn: function (e) {
            e.preventDefault();
            var column = $(e.target).closest(".column");
            if (column.hasClass("rotate")) {
                column.attr('style', '');
                column.find(".opportunity, .revenue").show();
                column.find(".dropDownMenu").hide();
                column.find(".columnNameDiv");
                column.removeClass("rotate");
                // column.find(".counter, .foldUnfold img").attr('style', '');;
            } else {
                column.css('max-width', '40px');
                column.find(".opportunity, .dropDownMenu, .revenue").hide();
                column.addClass("rotate");
                column.find(".columnNameDiv").removeClass("selected");
                // column.find(".counter, .foldUnfold img").css({ 'position': 'relative', 'right': '6px', 'top': '-12px' });
            }
        },

        checked: function () {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteItems: function () {
            var that = this,
        		mid = 39,
                model,
                viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "kanban":
                    {
                        model = this.model;
                        var remaining = model.get("estimated");
                        this.$("#delete").closest(".task").fadeToggle(200, function () {
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                            $(this).remove();
                        });
                        var column = this.$el.closest(".column");
                        column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                        column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) - remaining);
                        //this.collection.trigger('reset');
                        break;
                    }
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = that.collection.get(checkbox.value);
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                        });

                        this.collection.trigger('reset');
                        break;
                    }
                case "form":
                    {
                        model = this.collection.get($(".form-holder form").data("id"));
                        model.on('change', this.render, this);
                        model.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                Backbone.history.navigate("#home/content-Opportunities", { trigger: true });
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ContentView;
});
