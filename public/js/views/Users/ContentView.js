define([
    'text!templates/Users/list/UsersTemplate.html',
    'text!templates/Users/form/UsersTemplate.html',
    'collections/Users/UsersCollection',
    'views/Users/list/UsersItemView',
    'custom'
],
function (UserListTemplate, UserFormTemplate, UsersCollection, UsersItemView, Custom) {
    var UsersView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function(options){
            console.log('Init Users View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },
        events:{
            "click .chechbox":"checked"
        },
        checked: function(){
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },
        deleteItems: function () {
            var that = this,
                mid = 39;

            $.each($("tbody input:checked"), function (index, checkbox) {
                var user = that.collection.get(checkbox.value);
                user.destroy({
                        headers: {
                            mid: mid
                        }
                    },
                    { wait: true }
                );
            });

            this.collection.trigger('reset');
        },
        render: function(){
        	Custom.setCurrentCL(this.collection.models.length);
        	console.log('Render Users View');
            var viewType = Custom.getCurrentVT();
            switch(viewType)
            {
            	case "list":
            	{
            	    this.$el.html(_.template(UserListTemplate));
	                var table = this.$el.find('table > tbody');
	
	                this.collection.each(function(model){
	                    table.append(new UsersItemView({ model: model }).render().el);
	                });

                    $('#check_all').on('click',function(){
                        $(':checkbox').prop('checked', this.checked);
                    });
					break;
            	}
                case "form":
            	{
            		var itemIndex = Custom.getCurrentII()-1;
            		if (itemIndex > this.collection.models.length - 1)
            		{
            			itemIndex = this.collection.models.length - 1;
            			Custom.setCurrentII(this.collection.models.length);
            		}
            		
            		if (itemIndex == -1) 
            		{
            			this.$el.html();
            		}else
            		{
            			var currentModel = this.collection.models[itemIndex];
            			this.$el.html(_.template(UserFormTemplate, currentModel.toJSON()));
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
