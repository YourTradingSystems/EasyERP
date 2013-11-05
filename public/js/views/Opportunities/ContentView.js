define([
    'jqueryui',
    'text!templates/Opportunities/list/ListTemplate.html',
    'text!templates/Opportunities/form/FormTemplate.html',
    'text!templates/Opportunities/kanban/KanbanTemplate.html',
    'collections/Opportunities/OpportunitiesCollection',
    'collections/Leads/LeadsCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/Opportunities/kanban/KanbanItemView',
    'custom',
    'common'
],

function (jqueryui, ListTemplate, FormTemplate, KanbanTemplate, OpportunitiesCollection, LeadsCollection, WorkflowsCollection, KanbanItemView, Custom, common) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Opportunities View');
            var that = this;
            this.workflowsCollection = new WorkflowsCollection({ id: 'Opportunity' });
            this.workflowsCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();         

            $(window).resize(function () {
                that.$(".scroll-x").css("min-height", function () { var h = $(window).height() - 101; var height = h + 'px'; return height; });
                that.$(".column").css("height", function () { var h = $(".kanban").height(); var height = h + 'px'; return height; });
            });

        },

        events: {
            "click .checkbox": "checked",
            "click .foldUnfold": "openDropDown",
            "click .fold": "foldUnfoldColumn",
            "click .breadcrumb a, #lost, #won": "changeWorkflow",
            "click #hire": "isEmployee",
            "click #tabList a": "switchTab",
            "click td:not(:has('input[type='checkbox']'))": "gotoForm"
        },

        gotoForm: function (e) {
            App.ownContentType = true;
            var itemIndex = $(e.target).closest("tr").data("index") + 1;
            window.location.hash = "#home/content-Opportunities/form/" + itemIndex;
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
            var workflows = this.workflowsCollection.models;
            switch (viewType) {
                case "kanban":
                    {
                        this.$el.html(_.template(KanbanTemplate));

                        _.each(workflows, function (workflow, index) {
                            $("<div class='column' data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><div class='columnNameDiv'><h2 class='columnName'>" + workflow.get('name') + "</h2></div></div>").appendTo(".kanban");
                        });

                        $(".column").last().addClass("lastColumn");

                        _.each(workflows, function (workflow, i) {
                            var counter = 0,
                                revenue = 0,
                                kanbanItemView;
                            var column = this.$(".column").eq(i);
                            _.each(this.collection.models, function (model) {
                                if (model.get("workflow").name === column.data("name")) {
                                    kanbanItemView = new KanbanItemView({ model: model });
                                    kanbanItemView.bind('deleteEvent', this.deleteItems, kanbanItemView);
                                    column.append(kanbanItemView.render().el);
                                    counter++;
                                    revenue += model.get("expectedRevenue").value;
                                }
                            }, this);
                            column.find(".columnNameDiv").append("<p class='counter'>" + counter + "</p><a class='foldUnfold' href='#'><img hidden='hidden' src='./images/downCircleBlack.png'/></a><ul hidden='hidden' class='dropDownMenu'></ul><p class='revenue'>Expected Revenues: <span>" + revenue + "</span></p>");
                        }, this);
                        break;
                    }
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate, {opportunitiesCollection:this.collection.toJSON()}));

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });

                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > this.collection.models.length - 1) {
                            itemIndex = this.collection.models.length - 1;

                            var urlParts = window.location.hash.split('/');
                            if (urlParts[4]) {
                                urlParts[4] = this.collection.models.length;
                                window.location.hash = urlParts.join('/');
                            }
                            Custom.setCurrentII(this.collection.models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html();
                        } else {
                            var currentModel = this.collection.models[itemIndex];
                            //currentModel.set({ nextAction: currentModel.get("nextAction").split('T')[0].replace(/-/g, '/') });
                            currentModel.on('change', this.render, this);
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));


                            _.each(workflows, function (workflow, index) {
                                $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                                if (index == workflows.length - 1)
                                    this.$(".breadcrumb li").last().hide();
                            });

                            _.each(workflows, function (workflow, i) {
                                var breadcrumb = this.$(".breadcrumb li").eq(i);
                                if (currentModel.get("workflow").name === breadcrumb.data("name")) {
                                    breadcrumb.find("a").addClass("active");
                                    var button = breadcrumb.closest(".breadcrumb").siblings();
                                    if (breadcrumb.is(':nth-last-child(2)') || breadcrumb.is(':last-child')) {
                                        button.hide();
                                    }
                                    else {
                                        button.show();
                                    }
                                    if (breadcrumb.is(':last-child')) {
                                        this.$(".breadcrumb li").last().show();
                                    }
                                }
                            }, this);
                        }

                        break;
                    }
            }

            this.$(".scroll-x").css("height", function () { var h = $(window).height() - 101; var fh = h + 'px'; return fh });
            this.$(".column").css("height", function () { var h; h = $(".kanban").height(); var height = h + 'px';  return height; });
            this.$(".kanban").width((this.$(".column").width() + 1) * workflows.length);

            this.$(".column").sortable({
                connectWith: ".column",
                cancel: "h2",
                cursor: "move",
                items: ".opportunity",
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
                        workflow: {
                            name: column.data("name"),
                            status: column.data("status")
                        }
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

        changeWorkflow: function (e) {
            var mid = 39;
            var name = '', status = '';
            var breadcrumbList = $(e.target).closest(".formHeader").find(".breadcrumb");
            var length = this.workflowsCollection.models.length;
            var breadcrumb = $(e.target).closest('li');
            var button = breadcrumb.closest(".breadcrumb").siblings();
            var a = breadcrumb.siblings().find("a");
            this.$(".breadcrumb li").last().hide();
            if (a.hasClass("active")) {
                a.removeClass("active");
            }
            breadcrumb.find("a").addClass("active");
            if (breadcrumb.is(':nth-last-child(2)')) {
                button.hide();
            }
            else {
                button.show();
            }
            if ($(e.target).hasClass("applicationWorkflowLabel")) {
                name = breadcrumb.data("name");
                status = breadcrumb.data("status");
            }
            else {
                var workflow = {};
                if ($(e.target).attr("id") == "won") {
                    workflow = this.workflowsCollection.models[length - 2];
                }
                else {
                    workflow = this.workflowsCollection.models[length - 1];
                    console.log(breadcrumbList.children().length);
                    if (breadcrumbList.children().length == length) {
                        this.$(".breadcrumb li").last().show();
                    }
                }
                name = workflow.get('name');
                status = workflow.get('status');
            }
            var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
            model.unbind('change');
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
                column.find(".counter, .foldUnfold img").attr('style', '');;
            } else {
                column.css('max-width', '40px');
                column.find(".opportunity, .dropDownMenu, .revenue").hide();
                column.addClass("rotate");
                column.find(".columnNameDiv").removeClass("selected");
                column.find(".counter, .foldUnfold img").css({ 'position': 'relative', 'right': '6px', 'top': '-12px' });
            }

        },

        checked: function (event) {
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
                        model = this.collection.get(this.$el.attr("id"));
                        var revenue = model.get("expectedRevenue").value;
                        this.$("#delete").closest(".opportunity").fadeToggle(300, function () {
                            model.destroy(
                               {
                                   headers: {
                                       mid: mid
                                   }
                               });
                            $(this).remove();
                        });
                        var column = this.$el.closest(".column");
                        column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                        column.find(".revenue span").html(parseInt(column.find(".revenue span").html()) - revenue);
                        this.collection.trigger('reset');
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
