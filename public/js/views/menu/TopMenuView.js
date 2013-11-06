define([
    'views/menu/TopMenuItemView'
],
    function(TopMenuItemView){

        var TopMenuView = Backbone.View.extend({
            tagName:'ul',
            el: '#topmenu-holder nav ul',
            selectedModule:null,
            initialize: function(options){
                console.log("init MenuView");
                if(!options.collection) throw "No collection specified!";
                this.collection = options.collection;

                this.render();

                _.bindAll(this, 'render', 'clickItem');

            },

            events:{
                "click": "clickItem",
                "mouseover": "mouseOver"
            },
           
            clickItem: function(event){
                event.preventDefault();
                this.selectedModule = $(event.target).text();
                this.trigger('changeSelection', this.selectedModule);
                this.render();
            },

            mouseOver: function (event) {
                event.preventDefault();
                this.selectedModule = $(event.target).text();
                this.trigger('mouseOver', this.selectedModule);
                //this.render();
            },

            render: function(){
                if (this.selectedModule == null)
                    this.selectedModule = (this.collection[0]).get('mname');
                console.log("Render TopMenuView");
                var self = this;
                this.$el.empty();
                _.each(this.collection,function(model){
                    var view = new TopMenuItemView({model:model});
                    var item = view.render().el;
                    if(model.get('mname')==self.selectedModule)
                        $(item).addClass('selected');
                    self.$el.append(item);
                });
                return this;
            }
        });

        return TopMenuView;
    }
)






























