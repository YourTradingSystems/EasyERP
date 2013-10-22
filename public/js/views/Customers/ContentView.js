define([
    "jquery",
    "underscore",
    "backbone",
    "collections/Persons/PersonsCollection",
    "collections/Companies/CompaniesCollection",
    'text!templates/Customers/list/ListTemplate.html',
    'views/Persons/list/ListItemView',
    'views/Companies/list/ListItemView',
    'custom',
    'common'

],
function ($, _, Backbone, PersonsCollection, CompaniesCollection, ListTemplate, PersonsItemView, CompaniesItemView, Custom, common) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',

        //template: _.template(ListTemplate),

        initialize: function (options) {
            //console.log('Init Customers View');
            //this.collection = options.collection;

            this.personCollection = new PersonsCollection();
            this.personCollection.bind('reset', _.bind(this.render, this));
            this.companiesCollection = new CompaniesCollection();
            this.companiesCollection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
            "click .checkbox": "checked"
        },

        render: function () {
            Custom.setCurrentCL(this.personCollection.length);
            console.log('Render Person View');
            var viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate));
                        var table = this.$el.find('table > tbody');

                        this.companiesCollection.each(function (model) {
                            table.append(new CompaniesItemView({ model: model }).render().el);
                        });

                        this.personCollection.each(function (model) {
                            table.append(new PersonsItemView({ model: model }).render().el);
                        });
                        break;
                    }
                case "thumbnails":
                    {
                        this.$el.html("Customers Thumbnail View");
                        /*this.$el.html('');
                        var holder = this.$el;
                        this.collection.each(function(model){
                            $(holder).append(new ThumbnailsItemView({model:model}).render().el);
                        });*/
                        break;
                    }
                case "form":
                    {
                        this.$el.html("Customers Form View");
                        /*var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > this.collection.length - 1)
                        {
                            itemIndex = this.collection.length - 1;
                            Custom.setCurrentII(this.collection.length);
                        }
                        
                        if (itemIndex == -1) 
                        {
                            this.$el.html();
                        }
                        else
                        {
                            var currentModel = this.collection.models[itemIndex];
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                        }*/

                        break;
                    }
                case "gantt":
                    {
                        this.$el.html("CustomersGantView");
                        /*console.log('render gantt');
                        if(this.collection){
                            var collection = this.collection.toJSON();
                            var ganttChart =  Custom.createGanttChart(collection, false);
                            this.$el.html('<div style="width:1180px; height:550px; position:relative;" id="GanttDiv"></div>');
                            ganttChart.create("GanttDiv");
                        }*/
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
            var self = this,
        		mid = 39;

            $.each($("input:checked"), function (index, checkbox) {
                var project = self.collection.where({ id: checkbox.value })[0];

                /*project.set("projectName", 'testEDIT');
        		
        		project.save({},{
        			headers: {
        				uid: uid,
        				hash: hash,
        				mid: mid
        			}
        		});*/

                project.destroy({
                    headers: {
                        mid: mid
                    }
                },
        		{ wait: true }
        		);
            });

            this.collection.trigger('reset');
        }
    });

    return ContentView;
});
