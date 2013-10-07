define([
    'text!templates/Persons/list/ListTemplate.html',
    'text!templates/Persons/form/FormTemplate.html',
    'views/Persons/list/ListItemView',
    'views/Persons/thumbnails/ThumbnailsItemView',
    'custom'

], function (ListTemplate, FormTemplate, ListItemView, ThumbnailsItemView, Custom) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function(options){
            console.log('Init Persons View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
        	"click .checkbox": "checked"
        },
        
        render: function(){
        	Custom.setCurrentCL(this.collection.length);
            console.log('Render Persons View');
            var viewType = Custom.getCurrentVT();
            switch(viewType)
            {
            	case "list":
            	{
	        		this.$el.html(_.template(ListTemplate));
	                var table = this.$el.find('table > tbody');
	
	                this.collection.each(function(model){
	                    table.append(new ListItemView({model:model}).render().el);
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
	                this.collection.each(function(model){
	                	$(holder).append(new ThumbnailsItemView({model:model}).render().el);
	                });
	                break;
            	}
            	case "form":
            	{
            	    var itemIndex = Custom.getCurrentII() - 1;
            		if (itemIndex > this.collection.models.length - 1)
            		{
            			itemIndex = this.collection.models.length - 1;
            			Custom.setCurrentII(this.collection.models.length);
            		}
            		
            		if (itemIndex == -1) 
            		{
            			this.$el.html();
            		}
                    else
            		{
            			var currentModel = this.collection.models[itemIndex];
            			this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
            		}
            		break;
            	}
            }
            
            return this;
        },
        
        checked: function(event)
        {
        	if ($("input:checked").length > 0)
        		$("#top-bar-deleteBtn").show();
        	else
        		$("#top-bar-deleteBtn").hide();
        },
        
        deleteItems: function()
        {
            var self = this,
                mid = 39;

            if(Custom.getCurrentVT()==="form"){
                var index = Custom.getCurrentII() - 1;
                var person = this.collection.models[index];

                if(person){
                    person.destroy({headers: {
                        mid: mid
                    }});
                    Custom.setCurrentII(Custom.getCurrentII()-1);
                    this.collection.trigger('reset');
                    return;
                }


            }
        	
        	$.each($("input:checked"), function(index, checkbox){
        		var id = $(checkbox).val();
                var person = self.collection.get(id);

                person.destroy({headers: {
        			mid: mid
        		}});
        	});
        	
        	this.collection.trigger('reset');
        }
    });

    return ContentView;
});
