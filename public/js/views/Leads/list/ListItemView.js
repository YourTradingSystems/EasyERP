define([
    'common',
    'text!templates/Leads/list/ListTemplate.html',
    'text!templates/stages.html'
],

	   function (common, ListTemplate, stagesTamplate) {
	       var LeadsListItemView = Backbone.View.extend({
	           el: '#listTable',
	           stages: null,
	           initialize: function (options) {
                   this.collection = options.collection;
	               this.startNumber = (options.page - 1 ) * options.itemsNumber;//Counting the start index of list items
               },
	           events: {
	               "click .stageSelect": "showNewSelect",
	               "click .newSelectList li": "chooseOption"
	           },
	           hideNewSelect: function (e) {
	               $(".newSelectList").hide();
	           },
	           showNewSelect: function (e) {
	               if ($(".newSelectList").is(":visible")) {
	                   this.hideNewSelect();
	                   return false;
	               } else {
	                   $(e.target).parent().append(_.template(stagesTamplate, { stagesCollection: this.stages, startNumber: this.startNumber }));
	                   return false;
	               }

	           },

	           chooseOption: function (e) {
	               var targetElement = $(e.target).parents("td");
	               var id = targetElement.attr("id");
	               var obj = this.collection.get(id);
	               obj.set({ workflow: $(e.target).attr("id"), workflowForList:true});
	               obj.save({}, {
	                   headers: {
	                       mid: 39
	                   },
	                   success: function () {
	                       targetElement.find(".stageSelect").text($(e.target).text());
	                       targetElement.parent().attr("class","stage-"+$(e.target).text().toLowerCase());
	                   }
	               });

	               this.hideNewSelect();
	               return false;
	           },

	           pushStages: function(stages) {
	               this.stages = stages;
	           },

	           render: function () {
	               var self = this;
                   this.$el.append(_.template(ListTemplate, { leadsCollection: this.collection.toJSON(), startNumber: this.startNumber }));
                   $(document).on("click",function(e){
					   self.hideNewSelect(e);
				   });
	           }
	       });

	       return LeadsListItemView;
	   });
