define([
    'text!templates/Opportunities/list/ListTemplate.html',
    "common"
],

function (OpportunitiesListTemplate, common) {
    var OpportunitiesListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = options.startNumber;
        },
        events: {
            "click .current-selected": "showNewSelect",
            "click .newSelectList li": "chooseOption",
        },

		hideNewSelect:function(e){
			$(".newSelectList").remove();;
		},
		showNewSelect:function(e){
			if ($(".newSelectList").length){
				this.hideNewSelect();
				return false;
			}else{
				var s="<ul class='newSelectList'>";
				$(e.target).parent().find("select option").each(function(){
					s+="<li class="+$(this).text().toLowerCase()+">"+$(this).text()+"</li>";
				});
				s+="</ul>";
				$(e.target).parent().append(s);
				return false;
			}
			
		},

		chooseOption:function(e){
			var k = $(e.target).parent().find("li").index($(e.target));
			$(e.target).parents("td").find("select option:selected").removeAttr("selected");
			$(e.target).parents("td").find("select option").eq(k).attr("selected","selected");
			$(e.target).parents("td").find(".current-selected").text($(e.target).text());
			var id=$(e.target).parents("td").find("select").attr("id").replace("stage","");
			var obj = this.collection.get(id);
			obj.set({workflow: $(e.target).parents("td").find("select option").eq(k).data("id")})
            obj.save({}, {
                headers: {
                    mid: 39
                },
                success: function () {
                }
            });

			this.hideNewSelect();
			return false;
		},

		styleSelect:function(id){
			$(id).parent().find(".current-selected").remove();
			var text = $(id).find("option:selected").length==0?$(id).find("option").eq(0).text():$(id).find("option:selected").text();
			$(id).parent().append("<a class='current-selected forList' href='javascript:;'>"+text+"</a><div class='clearfix'></div>");
			$(id).hide();
			$(document).on("click",this.hideNewSelect);
		},

        render: function() {
			var self= this;
            this.$el.append(_.template(OpportunitiesListTemplate, { opportunitiesCollection: this.collection.toJSON(), startNumber: this.startNumber }));
			var oppCollection=this.collection.toJSON();
			for (var i=0;i<oppCollection.length;i++){
				var item = oppCollection[i];
				var id="#stage"+item._id;
                common.populateWorkflows("Opportunity", id, "", "/Workflows", item,function(id){
					self.styleSelect(id);
				});
				
			}
        },
    });

    return OpportunitiesListItemView;
});
