define([
    "text!templates/Users/CreateUserTemplate.html",
    "collections/Users/UsersCollection",
    "collections/Companies/CompaniesCollection",
    "collections/Profiles/ProfilesCollection",
    "models/UserModel"
],
    function (CreateUserTemplate, UsersCollection, CompaniesCollection, ProfilesCollection, UserModel) {

        var UsersCreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Users",
            template: _.template(CreateUserTemplate),
            contentType: "Users",
            initialize: function () {
                this.usersCollection = new UsersCollection();
                this.usersCollection.bind('reset', _.bind(this.render, this));
                this.profilesCollection = new ProfilesCollection();
                this.profilesCollection.bind('reset', _.bind(this.render, this));
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));
                this.model = new UserModel();
                this.render();
            },

            close: function () {
                //this._modelBinder.unbind();
            },

            events: {
                "submit form": "submit"
            },

            submit: function (event) {
                var self = this;
                event.preventDefault();
                var mid = 39;
                this.model = new UserModel();
                this.model.set({
                    uemail:$('#email').val(),
                    ulogin:$('#login').val(),
                    upass:$('#password').val(),
                    profile:{
                        company:{
                            id:$('#companiesDd option:selected').val(),
                            name: $('#companiesDd option:selected').text()
                        },
                        profile:{
                            id:$('#profilesDd option:selected').val(),
                            name: $('#profilesDd option:selected').text()
                        }
                    }
                }, {validate:true, confirmPass:$('#confirmpassword').val()});
                this.model.save(null,
                    {
                        headers: {
                            mid: mid
                        }, 
                        wait: true, 
                        success: function (model) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        },
                        confirmPass:$('#confirmpassword').val()
                    });
                Backbone.history.navigate("home/content-"+this.contentType, {trigger:true});

            },
            render: function () {
                this.$el.html(this.template({ model:this.model.toJSON(), usersCollection: this.usersCollection, companiesCollection: this.companiesCollection, profilesCollection:this.profilesCollection }));
                return this;
            }
        });

        return UsersCreateView;
    });