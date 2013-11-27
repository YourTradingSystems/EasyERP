define([
    'text!templates/JobPositions/list/ListTemplate.html',
    'text!templates/JobPositions/form/FormTemplate.html',
    'collections/JobPositions/JobPositionsCollection',
    'collections/Workflows/WorkflowsCollection',
    'custom',
    'views/JobPositions/EditView'
],
function (ListTemplate, FormTemplate, JobPositionsCollection, WorkflowsCollection, Custom, EditView) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init JobPositions View');
            this.workflowsCollection = new WorkflowsCollection({ id: 'Job Position' });
            this.workflowsCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            //this.render();
        },

        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).parent("tr").data("id") ;
            window.location.hash = "#home/content-JobPositions/form/" + id;
        },

        events: {
            "click .checkbox": "checked",
            "click .breadcrumb a": "changeWorkflow",
            "click td:not(:has('input[type='checkbox']'))": "gotoForm"
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render JobPositions View');
            var viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate, {jobPositionsCollection:this.collection.toJSON()}));
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
                            Custom.setCurrentII(this.collection.models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html();
                        } else {
                            this.$el.html();
                            var currentModel = this.collection.models[itemIndex];
                            //currentModel.off('change');
                            //currentModel.on('change:workflow', _.bind(this.render, this));
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                        }
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
                },
                wait: true
            });

        },

        checked: function () {
            if(this.collection.length > 0){
                if ($("input:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            }

        },
        editItem: function(){
            //create editView in dialog here
            new EditView({collection:this.collection});
        },

        deleteItems: function () {
            var self = this,
                mid = 39,
                model,
                viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = self.collection.get(checkbox.value);
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
                                Backbone.history.navigate("#home/content-JobPositions", { trigger: true });
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ContentView;
});
