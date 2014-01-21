define([
    "text!templates/myProfile/UsersPagesTemplate.html",
    "text!templates/myProfile/ChangePassword.html",
    'common',
    "models/UsersModel",
    'dataService'
],
    function (UsersPagesTemplate, ChangePassword, common, UsersModel, dataService) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "myProfile",
            actionType: "Content",
            template: _.template(ChangePassword),
            imageSrc: '',
            initialize: function (options) {
                this.startTime = options.startTime;
                this.render();
            },
            events: {
                "click .changePassword": "changePassword",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click #resetBtn": "resetForm",
                "click #saveBtn": "save",
                "click #RelatedEmployee li > a": "gotoEmployeesForm"
            },

            changePassword: function (e) {
                e.preventDefault();
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "change-password-dialog",
                    width: "80%",
                    title: "Change Password",
                    buttons: {
                        save: {
                            text: "Save",
                            class: "btn",
                            click: self.ChangePassword
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: function () {
                                self.hideDialog();
                            }
                        }
                    }
                });
            },

            ChangePassword: function (e) {
                e.preventDefault();
                dataService.getData('/currentUser', null, function (response, context) {
                    context.UsersModel = new UsersModel(response.pass);
                    context.UsersModel.urlRoot = '/currentUser';
                    var self = this;
                    var mid = 39;
                    context.UsersModel.save({
                        oldpass: $.trim($('#old_password').val()),
                        pass: $.trim($('#new_password').val()),
                        confirmPass: $.trim($('#confirm_new_password').val())
                    },
	                {
	                    headers: {
	                        mid: mid
	                    },
	                    wait: true,
	                    success: function () {
	                        $(".change-password-dialog").remove();
	                        Backbone.history.navigate("easyErp/myProfile", { trigger: true });
	                    },
	                    error: function () {
	                        Backbone.history.navigate("home", { trigger: true });
	                    },
	                    confirmPass: $.trim($('#confirm_new_password').val())
	                });
                }, this);

            },

            save: function (e) {
                e.preventDefault();
                e.preventDefault();
                dataService.getData('/currentUser', null, function (response, context) {

                    var dataResponse = {
                        login: response.login,
                        email: response.email,
                        RelatedEmployee: response.RelatedEmployee
                    };
                    context.UsersModel = new UsersModel(dataResponse);
                    context.UsersModel.urlRoot = '/currentUser';
                    var self = this;
                    var mid = 39;
                    context.UsersModel.save({
                        imageSrc: imageSrc,
                        email: $.trim($("#email").val()),
                        login: $.trim($("#login").val()),
                        RelatedEmployee: $("input[type='radio']:checked").attr("data-id")
                    },
	                {
	                    headers: {
	                        mid: mid
	                    },
	                    wait: true,
	                    success: function () {
	                        $(".change-password-dialog").remove();
	                        Backbone.history.navigate("easyErp/myProfile", { trigger: true });
	                    },
	                    error: function () {
	                        Backbone.history.navigate("home", { trigger: true });
	                    },
	                    editMode: true
	                });
                }, this);
            },

            resetForm: function (e) {
                e.preventDefault();
                $(':input', '#createUserForm')
            	 .not(':button, :submit, :reset, :hidden')
            	 .val('')
            	 .removeAttr('checked')
            },

            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display: "block"
                }, 250);

            },
            hideEdit: function () {
                $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

            },

            hideDialog: function () {
                $(".change-password-dialog").remove();
            },

            gotoEmployeesForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest("a").attr("id");
                window.location.hash = "#easyErp/Employees/form/" + itemIndex;
            },

            render: function () {
                dataService.getData('/currentUser', null, function (response, context) {
                    dataService.getData('/getForDdByRelatedUser', null, function (RelatedEmployee) {
                        var date = new Date();
                        var minutes = date.getTimezoneOffset();
                        if (minutes < 0)
                            var timezone = ("UTC " + minutes / 60);
                        else
                            var timezone = ("UTC " + minutes / 60);
                        var model = response;
                        context.$el.html(_.template(UsersPagesTemplate,
	                            {
	                                model: model,
	                                RelatedEmployee: RelatedEmployee.data,
	                                timezone: timezone
	                            }));
                        common.canvasDraw({ model: model }, this);

                        if (response.RelatedEmployee) {
                            $("input[type='radio'][value=" + response.RelatedEmployee + "]").attr("checked", true);
                        }
                        else {
                            $("input[type='radio']:first").attr("checked", true);
                        }
                        context.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - context.startTime) + " ms</div>");
                    }, this);
                }, this);

                return this;
            }
        });

        return ContentView;
    });
