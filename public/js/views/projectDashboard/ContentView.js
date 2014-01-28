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
			   populateProjectForDashboard:function (url, callback) {
				   var self = this;
				   dataService.getData(url, {}, function (response) {
					   if (callback) callback(response);
				   });
			   },
			renderProjectPM:function(){
				var self = this;
				this.populateProjectForDashboard("/getProjectPMForDashboard",function(collection){
					collection = collection.data;
					collection.forEach(function(item){
						$("#ProjectPMContent").append("<tr><td>"+item.projectmanager.name.first+" "+item.projectmanager.name.last+"</td><td>"+item.projectName+"</td></tr>");
					});
				});
			},     
			renderProjectStatus:function(){
				var self = this;
				this.populateProjectForDashboard("/getProjectStatusCountForDashboard",function(collection){
					var n = collection.workflow.length;
					var k = collection.data.length;
					$("#projectStatus").append("<tr></tr>");
					for (var i=0;i<n;i++){
						$("#projectStatus tr").append("<th>"+collection.workflow[i].status+"</th>");	
					}
					$("#projectStatus").append("<tr></tr>");
					for (var i=0;i<n;i++){
						var s = 0;
						for (var j=0;j<k;j++){
							if (collection.workflow[i]._id==collection.data[j]._id){
								s = collection.data[j].count;
								break;
							}
						}
						$("#projectStatus tr").eq(1).append("<td>"+s+"</td>");					
					}

				});
			},     
      
               render: function () {
                   this.$el.html(this.template());
				   this.renderProjectPM();
				   this.renderProjectStatus();
				   var sat = new Date();
				   sat.setDate(sat.getDate() - sat.getDay() - 1);
	
				   var sat2 = new Date();
				   sat2.setDate(sat2.getDate() +(6 - sat2.getDay()));
				   sat.setHours(0,0,0,0);
				   sat2.setHours(0,0,0,0);
				   alert(sat);
				   alert(sat2);
               }
		   });
           return ContentView;
	   }
);
