define([
    'text!templates/Applications/list/ListTemplate.html',
    "common",
    'text!templates/Leads/list/stages.html'
],

function (ApplicationsListTemplate,common, stagesTamplate) {
    var ApplicationsListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = options.startNumber;
        },
        events: {
            "click .stageSelect": "showNewSelect",
            "click .newSelectList li": "chooseOption"
        },

         hideNewSelect: function (e) {
             $(".newSelectList").hide();
         },
         showNewSelect: function (e) {
             if ($(".newSelectList").length) {
                 this.hideNewSelect();
                 return false;
             } else {
                 $(e.target).parent().append(_.template(stagesTamplate, { stagesCollection: this.stages }));
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
                 }
             });

             this.hideNewSelect();
             return false;
         },

         pushStages: function(stages) {
             this.stages = stages;
         },

         render: function() {
		  	 var self= this;
             this.$el.append(_.template(ApplicationsListTemplate, { applicationsCollection: this.collection.toJSON(), startNumber: this.startNumber }));
			 $(document).on("click",function(){
			 	self.hideNewSelect();
			 });
         }
    });

    return ApplicationsListItemView;
});
