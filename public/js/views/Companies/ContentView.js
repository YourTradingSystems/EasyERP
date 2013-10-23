define([
    'text!templates/Companies/list/ListTemplate.html',
    'text!templates/Companies/form/FormTemplate.html',
    'collections/Companies/CompaniesCollection',
    'views/Companies/list/ListItemView',
    'views/Companies/thumbnails/ThumbnailsItemView',
    'custom',
    'common'

],
function (ListTemplate, FormTemplate, CompaniesCollection, ListItemView, ThumbnailsItemView, Custom, common) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Companies View');
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
            console.log('Render Companies View');
            var viewType = Custom.getCurrentVT(),
                models = this.collection.models;
            Custom.setCurrentCL(models.length);
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
                        var holder = this.$el;
                        var thumbnailsItemView;
                        _.each(models, function (model) {
                            thumbnailsItemView = new ThumbnailsItemView({ model: model });
                            thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                            $(holder).append(thumbnailsItemView.render().el);
                        }, this);
                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > models.length - 1) {
                            itemIndex = models.length - 1;
                            Custom.setCurrentII(models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html();
                        }
                        else {
                            var currentModel = models[itemIndex];
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
            if (this.companiesCollection.length > 0) {
                if ($("input:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            }
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
            Backbone.history.navigate("#home/content-Companies", { trigger: true });
        }
    });

    return ContentView;
});
