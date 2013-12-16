define([
    'text!templates/Calendar/TopBarTemplate.html',
    'custom'
],
    function (ContentTopBarTemplate, Custom) {
        var TopBarView = Backbone.View.extend({
            el:'#top-bar',
            contentType: "Calendar",
            template: _.template(ContentTopBarTemplate),
            events:{

            },

            initialize: function(options){
                this.render();
            },

            render: function(){
                this.$el.html(this.template({contentType:this.contentType}));
                return this;
            }
        });

        return TopBarView;
    });
