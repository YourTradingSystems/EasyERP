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
					var k=0;
					collection.forEach(function(item){
						k++;
						$("#ProjectPMContent").append("<tr><td>"+k+"</td><td>"+item.projectmanager.name.first+" "+item.projectmanager.name.last+"</td><td>"+item.projectName+"</td><td class='health'><div class='green'></div></td></tr>");
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
			renderProjectEnd:function(){
				var self = this;
				this.populateProjectForDashboard("/getProjectByEndDateForDashboard",function(data){
					data= data.data;
					$("#projectEnd").append("<tr><td>"+data.This+"</td><td>"+data.Next+"</td><td>"+data.Next2+"</td></tr>");

				});
			},     
      
               render: function () {
                   this.$el.html(this.template());
				   this.renderProjectPM();
				   this.renderProjectStatus();
				   this.renderProjectEnd();
               }
		   });
           return ContentView;
	   }
);
