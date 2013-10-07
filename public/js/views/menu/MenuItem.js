define([
    'text!templates/menu/MenuItemTemplate.html'
],
    function(MenuItemTemplate){

        var MenuItem = Backbone.View.extend({
            tagName: 'li',
            template: _.template(MenuItemTemplate),

            initialize: function(options){
                //_.bindAll(this, 'render');
                //this.model.bind('change', this.render);
            },
            close: function(){
                this.unbind();
                this.model.unbind();
            },
            render: function(){
                var template = this.template(this.model.toJSON());
                $(this.el).html(template);
                return this;
            }
        });

        return MenuItem;
    });