/**
 * Created with JetBrains PhpStorm.
 * User: Ivan
 * Date: 04.12.13
 * Time: 10:59
 * To change this template use File | Settings | File Templates.
 */

define([
    'text!templates/Applications/form/FormTemplate.html',
    'views/Applications/EditView'
],

    function (ApplicationsFormTemplate, EditView) {
        var FormApplicationsView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(ApplicationsFormTemplate, formModel));
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
                        Backbone.history.navigate("#easyErp/Applications/list", { trigger: true });
                    }
                });

            }
        });

        return FormApplicationsView;
    });