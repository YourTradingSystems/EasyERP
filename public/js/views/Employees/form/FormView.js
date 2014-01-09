define([
    'text!templates/Employees/form/FormTemplate.html',
    'views/Employees/EditView'
],

    function (EmployeesFormTemplate, EditView) {
        var FormEmployeesView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
            },
			events:{
				   'click .chart-tabs a': 'changeTab'
               },
			changeTab:function(e){
				$(e.target).closest(".chart-tabs").find("a.active").removeClass("active");
				$(e.target).addClass("active");
				var n = $(e.target).parents(".chart-tabs").find("li").index($(e.target).parent());
				$(".chart-tabs-items").find(".chart-tabs-item.active").removeClass("active");
				$(".chart-tabs-items").find(".chart-tabs-item").eq(n).addClass("active");
			},

            render: function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(EmployeesFormTemplate, formModel));
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
                        Backbone.history.navigate("#easyErp/Employees/list", { trigger: true });
                    }
                });

            }
        });

        return FormEmployeesView;
    });
