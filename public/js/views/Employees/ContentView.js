define([
    'text!templates/Employees/list/ListTemplate.html',
    'text!templates/Employees/form/FormTemplate.html',
    'views/Employees/thumbnails/ThumbnailsItemView',
    'custom',
    'common',
    'views/Employees/EditView',
    'views/Employees/CreateView',
    'text!templates/Alpabet/AphabeticTemplate.html'

],
function (ListTemplate, FormTemplate, ThumbnailsItemView, Custom, common, EditView, CreateView, AphabeticTemplate) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            this.collection = options.collection;
            this.originalCollection = options.collection;
            this.alphabeticArray = common.buildAphabeticArray(this.collection.toJSON());
            this.allAlphabeticArray = common.buildAllAphabeticArray();
			this.selectedLetter="All";
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
            "click .checkbox": "checked",
            "click #tabList a": "switchTab",
            "click td:not(:has('input[type='checkbox']'))": "gotoForm",
            "click .letter:not(.empty)": "alpabeticalRender"
        },
		alpabeticalRender:function(e){
			$(e.target).parent().find(".current").removeClass("current");
			$(e.target).addClass("current");
			this.collection = this.originalCollection.filterByLetter($(e.target).text());
			this.selectedLetter=$(e.target).text();
			this.render();
		},
        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).closest("tr").data("id");
            window.location.hash = "#home/content-Employees/form/" + id;
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
        createItem: function () {
            new CreateView();
        },
        editItem: function(){
            //create editView in dialog here
            new EditView({collection:this.collection});
        },

        render: function () {
            //Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Employees View');
            var viewType = Custom.getCurrentVT(),
                models = this.collection.models;
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(AphabeticTemplate, { alphabeticArray: this.alphabeticArray,selectedLetter: this.selectedLetter,allAlphabeticArray:this.allAlphabeticArray}));
                        this.$el.append(_.template(ListTemplate, {employeesCollection:this.collection.toJSON()}));

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

                        this.$el.html(_.template(AphabeticTemplate, { alphabeticArray: this.alphabeticArray,selectedLetter: this.selectedLetter,allAlphabeticArray:this.allAlphabeticArray}));
                        _.each(models, function (model) {
                            var dateBirth = new Date(model.get("dateBirth"));
							var p=model.get("dateBirth")
                            var today = new Date;
                            var age = today.getFullYear() - dateBirth.getFullYear();
                            if (today.getMonth() < dateBirth.getMonth() || (today.getMonth() == dateBirth.getMonth() && today.getDate() < dateBirth.getDate())) { age--; }
                            model.set({ age: age }, { silent: true });
                            thumbnailsItemView = new ThumbnailsItemView({ model: model });
                            thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                            var relatedUser = model.get("relatedUser");
                            var login = (relatedUser) ? relatedUser.login : '';
                            if (login) {
                                var _login = "(" + login + ")";
                                relatedUser.login = _login;
                                model.set({ relatedUser: relatedUser }, { silent: true });
                            }
                            if (today.getMonth() < dateBirth.getMonth() || (today.getMonth() == dateBirth.getMonth() && today.getDate() < dateBirth.getDate())) { age--; }

/*                            if (dateBirth) {
                                model.set({ dateBirth: dateBirth.format("dd/mm/yyyy") }, { silent: true });
                            }*/
                            $(holder).append(thumbnailsItemView.render().el);

                        }, this);
                        break;

                    }
                case "form":
                    {
                        var currentModel = this.collection.getElement();
                        if (!currentModel) {
                            this.$el.html('<h2>No Employees found</h2>');
                        } else {
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
            return this;

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
            var self = this,
                mid = 39,
                model,
                viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = self.collection.get(checkbox.value);
                            model.destroy(
                                {
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
//                        model.on('change', this.render, this);
                        model.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                Backbone.history.navigate("#home/content-Employees", { trigger: true });
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ContentView;
});
