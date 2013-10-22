define([
    'text!templates/SourceOfApplicants/list/ListTemplate.html',
    'text!templates/SourceOfApplicants/form/FormTemplate.html',
    'collections/SourceOfApplicants/SourceOfApplicantsCollection',
    'views/SourceOfApplicants/list/ListItemView',
    'custom',
    'common'
],
function (ListTemplate, FormTemplate, SourcesOfApplicantsCollection, ListItemView, Custom, common) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init SourceOfApplicants View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
            "click .checkbox": "checked"
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render SourceOfApplicants View');
            var viewType = Custom.getCurrentVT();
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
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                        }

                        break;
                    }
            }
            common.contentHolderHeightFixer();
            return this;

        },

        checked: function (event) {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteItems: function () {
            var that = this,
        		mid = 39,
                model,
                viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = that.collection.get(checkbox.value);

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
                case "form":
                    {
                        model = this.collection.get($("#wrap").data("id"));
                        var itemIndex = this.collection.indexOf(model);
                        model.on('change', this.render, this);
                        model.destroy({
                            headers: {
                                mid: mid
                            }
                        },
                        { wait: true }

                        );
                        this.collection.trigger('reset');
                        if (this.collection.length != 0) {
                            Backbone.history.navigate("#home/content-SourceOfApplicants/form/" + itemIndex, { trigger: true });
                        } else {
                            Backbone.history.navigate("#home/content-SourceOfApplicants", { trigger: true });
                        }
                        break;
                    }
            }
        }
    });

    return ContentView;
});
