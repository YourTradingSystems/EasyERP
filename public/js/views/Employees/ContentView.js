define([
    'text!templates/Employees/list/ListTemplate.html',
    'text!templates/Employees/form/FormTemplate.html',
    'collections/Employees/EmployeesCollection',
    'views/Employees/list/ListItemView',
    'views/Employees/thumbnails/ThumbnailsItemView',
    'custom',
    'common'

],
function (ListTemplate, FormTemplate, ProjectsCollection, ListItemView, ThumbnailsItemView, Custom, common) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Employees View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
            "click .checkbox": "checked",
            "click #tabList a": "switchTab"
        },

        switchTab: function (e) {
            e.preventDefault();
            var link = this.$("#tabList a");
            if (link.hasClass("selected")) {
                link.removeClass("selected");
            }
            var index = link.index($(e.target).addClass("selected"));
            this.$(".tab").hide().eq(index).show();
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Employees View');
            var viewType = Custom.getCurrentVT(),
                models = this.collection.models;
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate));
                        var table = this.$el.find('table > tbody');

                        this.collection.each(function (model) {
                            table.append(new ListItemView({ model: model }).render().el);
                        });

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });
                        break;
                    }
                case "thumbnails":
                    {
                        this.$el.html('');
                        var holder = this.$el,
                            thumbnailsItemView;


                        _.each(models, function (model) {
                            var dateBirth = new Date(model.get("dateBirth"));
                            var today = new Date;
                            var age = today.getFullYear() - dateBirth.getFullYear();
                            if (today.getMonth() < dateBirth.getMonth() || (today.getMonth() == dateBirth.getMonth() && today.getDate() < dateBirth.getDate())) { age--; }
                            model.set({ age: age }, { silent: true });
                            thumbnailsItemView = new ThumbnailsItemView({ model: model });
                            thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                            var relatedUser = model.get("relatedUser");
                            var login = relatedUser.login;
                            if (login) {
                                var _login = "(" + login + ")";
                                relatedUser.login = _login;
                                model.set({ relatedUser: relatedUser }, { silent: true });
                            }
                            //var dateBirth =new Date(model.get("dateBirth"));                            
                            //var today = new Date;
                            //var age = today.getFullYear() - dateBirth.getFullYear();
                            if (today.getMonth() < dateBirth.getMonth() || (today.getMonth() == dateBirth.getMonth() && today.getDate() < dateBirth.getDate())) { age--; }

                            if (dateBirth) {
                                model.set({ dateBirth: dateBirth.format("dd/mm/yyyy") }, { silent: true });
                            }
                            $(holder).append(thumbnailsItemView.render().el);

                        }, this);
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
                            var currentModel = this.collection.models[itemIndex];
                            var dateBirth = currentModel.get('dateBirth');
                            if (dateBirth) {
                                currentModel.set({ dateBirth: dateBirth.split('T')[0].replace(/-/g, '/') }, { silent: true });
                            }
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                        }

                        break;
                    }
            }
            $(holder).append('<div class="clearfix"></div>');
            common.contentHolderHeightFixer();
            return this;

        },

        checked: function () {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
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
                            },
                                { wait: true }
                            );
                        });

                        this.collection.trigger('reset');
                        break;
                    }
                case "thumbnails":
                    {
                        model = this.model.collection.get(this.$el.attr("id"));
                        this.$el.fadeToggle(300, function () {
                            model.destroy(
                                {
                                    headers: {
                                        mid: mid
                                    }
                                },
                                { wait: true });
                            $(this).remove();
                        });
                        break;
                    }
                case "form":
                    {
                        model = this.collection.get($(".form-holder form").data("id"));
                        model.on('change', this.render, this);
                        model.destroy({
                            headers: {
                                mid: mid
                            }
                        },
                        { wait: true }

                        );
                        this.collection.trigger('reset');
                        break;
                    }
            }
            Backbone.history.navigate("#home/content-Employees", { trigger: true });
        }
    });

    return ContentView;
});
