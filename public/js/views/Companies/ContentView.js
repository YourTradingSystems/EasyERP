define([
    'text!templates/Companies/list/ListTemplate.html',
    'text!templates/Companies/form/FormTemplate.html',
    'collections/Opportunities/OpportunitiesCollection',
    'collections/Persons/PersonsCollection',
    "collections/Events/EventsCollection",
    'views/Companies/thumbnails/ThumbnailsItemView',
    'views/Opportunities/compactContent',
    'views/Persons/compactContent',
    'custom',
    'common',
    'views/Calendar/compactCalendar'

],
function (ListTemplate, FormTemplate, OpportunitiesCollection, PersonsCollection, EventsCollection,ThumbnailsItemView, opportunitiesCompactContentView, personsCompactContentView, Custom, common, compactCalendar) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Companies View');
            this.collection = options.collection;
            this.opportunitiesCollection = new OpportunitiesCollection();
            this.opportunitiesCollection.bind('reset', _.bind(this.render, this));
            //this.eventsCollection = new EventsCollection();
            //this.eventsCollection.bind('reset', _.bind(this.render, this));
            this.personsCollection = new PersonsCollection();
            this.personsCollection.bind('reset', _.bind(this.render, this));
            //this.collection.bind('reset', _.bind(this.render, this));
            //this.render();
        },

        events: {
            "click .checkbox": "checked",
            "click #tabList a": "switchTab",
            "click td:not(:has('input[type='checkbox']'))": "gotoForm"
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
        
        gotoForm: function (e) {
            App.ownContentType = true;
            var itemIndex = $(e.target).closest("tr").data("index");
            window.location.hash = "#home/content-Companies/form/" + itemIndex;
        },
        render: function () {
            console.log('Render Companies View');
            var viewType = Custom.getCurrentVT(),
                models = this.collection.models;
            Custom.setCurrentCL(models.length);
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate, {companiesCollection:this.collection.toJSON()}));

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
                            var address = model.get('address');
                            if (address.city && address.country) {
                                //console.log(address.country);
                                address.city = address.city + ", ";
                                //console.log(address.city);
                                model.set({ address: address }, { silent: true });
                            }
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
                            this.$el.find('.formRightColumn').append(
                                new opportunitiesCompactContentView({
                                    collection: this.opportunitiesCollection,
                                    model: currentModel
                                }).render().el,
                                new personsCompactContentView({
                                    collection: this.personsCollection,
                                    model: currentModel
                                }).render().el
                                /*new compactCalendar({
                                    collection: this.eventsCollection,
                                    model:currentModel
                                }).render().el*/

                            );
                        }

                        break;
                    }
            }
            $(holder).append('<div class="clearfix"></div>');
            common.contentHolderHeightFixer();
            return this;

        },

        checked: function () {
            if (this.collection.length > 0) {
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
                            });
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
                                });
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
                            },
                            success: function () {
                                Backbone.history.navigate("#home/content-Companies", { trigger: true });
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ContentView;
});
