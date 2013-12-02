define([
    'text!templates/Users/list/ListTemplate.html',
    'text!templates/Users/form/FormTemplate.html',
    'views/Users/EditView',
    'views/Users/CreateView',
    'custom',
    'common'
],
function (ListTemplate, FormTemplate, EditView, CreateView, Custom, common) {
    var UsersView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Users View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },
        events: {
            "click .checkbox": "checked",
            "click td:not(:has('input[type='checkbox']'))": "gotoForm"
        },
        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).closest("tr").data("id");
            window.location.hash = "#home/content-Users/form/" + id;
        },
        createItem: function () {
            new CreateView();
        },
        editItem: function () {
            //create editView in dialog here
            new EditView({ collection: this.collection });
        },
        checked: function () {
            if(this.collection.length > 0){
                if ($("input:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            }
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
            //this.checked();
            //Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Users View');
            var viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate, { usersCollection: this.collection.toJSON()}));

                        $('#check_all').on('click', function () {
                            $(':checkbox').prop('checked', this.checked);
                        });
                        break;
                    }
                case "form":
                    {
                        var currentModel = this.collection.getElement();
                        if(!currentModel){
                            this.$el.html("<h2>No users found.</h2>");
                        } else {
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                        }
                        break;
                    }
                case "thumbnails":
                    this.$el.html("Thumbnails View");
                    break;
            }
            return this;

        }
    });

    return UsersView;
});
