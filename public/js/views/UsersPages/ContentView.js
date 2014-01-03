define([
    "text!templates/UsersPages/UsersPagesTemplate.html",
    'common'
],
    function (UsersPagesTemplate, common) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "UserPages",
            actionType:"Content",
            initialize: function (options) {
                this.usersCollection = options.collection;
                this.usersCollection.bind('add', _.bind(this.render, this));
                this.usersCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },
            events:{

            },

            render: function () {
                this.$el.html(_.template(UsersPagesTemplate,
                    { usersCollection:this.usersCollection.toJSON(),
                        contentType: this.contentType
                    }));
                console.log(this.usersCollection.toJSON());
                return this;
            }
        });

        return ContentView;
    });
