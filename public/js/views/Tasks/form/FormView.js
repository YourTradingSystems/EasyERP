define([
    'text!templates/Tasks/form/FormTemplate.html',
    'views/Tasks/EditView'
],

    function (TasksFormTemplate, EditView) {
        var FormTasksView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(TasksFormTemplate, formModel));
                return this;
            },
            
            editItem: function () {
                //create editView in dialog here
                new EditView({ model: this.formModel });
            },
            
            deleteItems: function () {
                var mid = 39;
                   
                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Tasks/list", { trigger: true });
                    }
                });

            }
        });

        return FormTasksView;
    });