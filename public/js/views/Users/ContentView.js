define([
    'text!templates/Users/list/UsersTemplate.html',
    'text!templates/Users/form/UsersTemplate.html',
    'collections/Users/UsersCollection',
    'views/Users/list/UsersItemView',
    'custom',
    'common'
],
function (UserListTemplate, UserFormTemplate, UsersCollection, UsersItemView, Custom, common) {
    var UsersView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Users View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },
        events: {
            "click .checkbox": "checked"
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
                viewType = Custom.getCurrentVT();

            switch (viewType) {
                case "list":
                    $.each($("tbody input:checked"), function (index, checkbox) {
                        var user = that.collection.get(checkbox.value);
                        user.destroy({
                            headers: {
                                mid: mid
                            }
                        });
                    });

                    this.collection.trigger('reset');
                    break;
                case "form":
                    var model = this.collection.get($(".form-holder form").data("id"));
                    var itemIndex = this.collection.indexOf(model);
                    model.on('change', this.render, this);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            Backbone.history.navigate("#home/content-Users", { trigger: true });
                        }
                    });
                    break;
            }


        },
        render: function () {
            this.checked();
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Users View');
            var viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(UserListTemplate));
                        var table = this.$el.find('table > tbody');
                        if (this.collection.length > 0) {
                            this.collection.each(function (model) {
                                table.append(new UsersItemView({ model: model }).render().el);
                            });
                        } else {
                            this.$el.html('<h2>No users found</h2>');
                        }


                        $('#check_all').on('click', function () {
                            $(':checkbox').prop('checked', this.checked);
                        });
                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > this.collection.length - 1) {
                            itemIndex = this.collection.length - 1;
                            Custom.setCurrentII(this.collection.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html("No users found");
                        } else {
                            var currentModel = this.collection.models[itemIndex];
                            this.$el.html(_.template(UserFormTemplate, currentModel.toJSON()));
                        }

                        break;
                    }
                case "thumbnails":
                    this.$el.html("Thumbnails View");
                    break;
            }
            common.contentHolderHeightFixer();
            return this;

        }
    });

    return UsersView;
});
