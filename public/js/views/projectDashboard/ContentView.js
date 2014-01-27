define([
    "text!templates/projectDashboard/DashboardTemplate.html",
	"common",
    "dataService",
],
       function (DashboardTemplate, common, dataService) {
		   var ContentView = Backbone.View.extend({
			   contentType: "Dashboard",
			   actionType: "Content",
               template: _.template(DashboardTemplate),
               el: '#content-holder',
               initialize: function (options) {
                   this.render();
               },
               events: {
                   "click .choseDateRange .item": "newRange"
               },
			   populateProjectPMForDashboard:function (url, callback) {
				   var self = this;
				   dataService.getData(url, {}, function (response) {
					   if (callback) callback(response.data);
				   });
			   },
			renderProjectPM:function(){
				var self = this;
				this.populateProjectPMForDashboard("/getProjectPMForDashboard",function(collection){
					console.log(collection);
					collection.forEach(function(item){
						$("#ProjectPMContent").append("<tr><td>"+item.projectmanager.name.first+" "+item.projectmanager.name.last+"</td><td>"+item.projectName+"</td></tr>");
					});
				});
			},           
               render: function () {
                   this.$el.html(this.template());
				   this.renderProjectPM();
               }
		   });
           return ContentView;
	   }
);
