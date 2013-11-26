define([
    'text!templates/Departments/list/ListTemplate.html',
    'text!templates/Departments/form/FormTemplate.html',
    'collections/Departments/DepartmentsCollection',
    'custom',
    'common',
    'views/Departments/EditView'
],
function (ListTemplate, FormTemplate, DepartmentsCollection, Custom, common, EditView) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },
        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).parent("tr").data("id");
            //var itemIndex = $(e.target).closest("tr").data("index") + 1;
            window.location.hash = "#home/content-Departments/form/" + id;
        },

        events: {
            "click .checkbox": "checked",
            "click td:not(:has('input[type='checkbox']'))": "gotoForm"
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Departments View');
            var viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate, {departmentsCollection:this.collection.toJSON()}));

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });
                        break;
                    }
                case "form":
                    {
						var currentModel = this.collection.getElement();
						if (currentModel) {
							var extrainfo = currentModel.get('extrainfo');
							this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
						} else {
							this.$el.html('<h2>No departments found</h2>');
						}

						/*
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > this.collection.models.length - 1) {
                            itemIndex = this.collection.models.length - 1;
                            Custom.setCurrentII(this.collection.models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html();
                        } else {
                            var currentModel = this.collection.models[itemIndex];
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                        }*/

                        break;
                    }
            }
            return this;

        },

        checked: function () {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
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
                                Backbone.history.navigate("#home/content-Departments", { trigger: true });
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ContentView;
});
