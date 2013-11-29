define([
    'text!templates/Projects/list/ListTemplate.html',
    'text!templates/Projects/form/FormTemplate.html',
    'views/Projects/thumbnails/ThumbnailsItemView',
    'views/Projects/EditView',
    'custom',
    "GanttChart",
    'common',
    'views/Projects/CreateView'
],
    function (ListTemplate, FormTemplate, ThumbnailsItemView, EditView, Custom, GanttChart, common, CreateView) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                this.collection = options.collection;
                this.render();
            },

            events: {
                "click .checkbox": "checked",
                "click .breadcrumb a": "changeWorkflow",
                "click td:not(:has('input[type='checkbox']'))": "gotoForm"
            },

            createItem: function () {
                new CreateView();
            },
            editItem: function () {
                //create editView in dialog here
                new EditView({ collection: this.collection });
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var id = $(e.target).closest("tr").data("id");
                window.location.hash = "#home/content-Projects/form/" + id;
            },

            render: function () {
                var viewType = Custom.getCurrentVT(),
                    models = this.collection.models;
                //Custom.setCurrentCL(models.length);
                switch (viewType) {
                    case "list":
                        {
                            this.$el.html(_.template(ListTemplate, { projectsCollection: this.collection.toJSON() }));

                            $('#check_all').click(function () {
                                var c = this.checked;
                                $(':checkbox').prop('checked', c);
                            });
                            break;
                        }
                    case "thumbnails":
                        {
                            this.$el.html('');
                            if (this.collection.length > 0) {
                                var holder = this.$el,
                                    thumbnailsItemView;
                                _.each(models, function (model) {
                                    thumbnailsItemView = new ThumbnailsItemView({ model: model });
                                    thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                                    $(holder).append(thumbnailsItemView.render().el);
                                }, this);
                            } else {
                                this.$el.html('<h2>No projects found</h2>');
                            }
                            break;
                        }
                    case "form":
                        {
                            var currentModel = this.collection.getElement();
                            if (!currentModel) {
                                this.$el.html('<h2>No projects found</h2>');
                            } else {
                                //if (App.hash) {
                                //    currentModel = this.collection.get(App.hash);
                                //} else {
                                //    currentModel = models[itemIndex];
                                //}

                                this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                            }

                            break;
                        }
                    case "gantt":
                        {
                            this.$el.html('<div style=" height:570px; position:relative;" id="GanttDiv"></div>');
                            GanttChart.create("GanttDiv");
                            if (this.collection.length > 0)
                                GanttChart.parseProjects(this.collection);

                            break;
                        }
                }
                return this;

            },

            changeWorkflow: function (e) {
                var mid = 39;
                var breadcrumb = $(e.target).closest('li');
                var a = breadcrumb.siblings().find("a");
                if (a.hasClass("active")) {
                    a.removeClass("active");
                }
                breadcrumb.find("a").addClass("active");
                var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                model.unbind('change');
                var ob = {
                    workflow: {
                        name: breadcrumb.data("name"),
                        status: breadcrumb.data("status")
                    }
                };

                model.set(ob);
                model.save({}, {
                    headers: {
                        mid: mid
                    }
                });

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
                    case "thumbnails":
                        {
                            model = this.model.collection.get(this.$el.attr("id"));
                            this.$el.fadeToggle(300, function () {
                                model.destroy({
                                    headers: {
                                        mid: mid
                                    }
                                });
                                $(this).remove();
                            });
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
                                    Backbone.history.navigate("#home/content-Projects", { trigger: true });
                                }
                            });
                            break;
                        }
                }
            }
        });

        return ContentView;
    });
