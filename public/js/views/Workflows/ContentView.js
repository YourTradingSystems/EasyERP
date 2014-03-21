define([
    'text!templates/Workflows/list/ListTemplate.html',
    'views/Workflows/list/ListItemView',
    'text!templates/Workflows/form/FormTemplate.html',
    'collections/RelatedStatuses/RelatedStatusesCollection',
    'views/Workflows/CreateView',
    'custom',
    "models/WorkflowsModel",
    "common",
    "collections/Workflows/WorkflowsCollection"
],
	   function (ListTemplate, ListItemView, FormTemplate, RelatedStatusesCollection, CreateView, Custom, WorkflowsModel, common, workflowsCollection) {
		   var ContentView = Backbone.View.extend({
			   el: '#content-holder',
			   initialize: function (options) {
				   this.startTime = options.startTime;
				   _.bindAll(this, "saveStatus", "render");
				   this.relatedStatusesCollection = new RelatedStatusesCollection();
				   this.relatedStatusesCollection.bind('reset', _.bind(this.render, this));
				   this.collection = options.collection;
				   this.collection.bind('reset', _.bind(this.render, this));
				   this.render();
			   },

			   events: {
				   "click .checkbox": "checked",
				   //"click td:not(:has('input[type='checkbox']'))": "gotoForm",
				   "click a.workflow": "chooseWorkflowNames",
				   "click .workflow-sub": "chooseWorkflowDetailes",
				   "click .workflow-list li": "chooseWorkflowDetailes",
				   "click #workflowNames div.cathegory a": "chooseWorkflowDetailes",
				   "click #workflowSubNames div.cathegory a": "chooseWorkflowDetailes",
				   "click #workflowNames span": "chooseWorkflowDetailes",
				   "click  .edit": "edit",
				   "click  .delete": "deleteItems",
				   "click #addNewStatus": "addNewStatus",
				   "click a.cancel": "cancel",
				   "click a.save": "save",
				   "click #saveStatus": "saveStatus",
				   "click #cancelStatus": "cancelStatus",
				   "click .editAll": "editAll",
				   "click .deleteAll": "deleteAll",
				   "click .saveAll": "saveAll",
				   "click .cancelAll": "cancelAll",
				   "mouseenter #workflows .row:not(.quickEdit)":"quickEdit",
				   "mouseleave .workflow-sub-list li": "removeEdit"
			   },

			   save: function (e) {
				   e.preventDefault();
				   var self = this;
				   var mid = 39;
				   $("#addNewStatus").show();
				   var tr = $(e.target).closest("div.row");
				   var name = tr.find("div.name input").val().trim();
				   var status = tr.find("div.status option:selected").text();
				   var tdName = tr.find("div.name");
				   var id = tdName.data("id");
				   var sequence = tdName.data("sequence");

                   var model = this.collection.get(id);
                   this.collection.url = "/Workflows";
				   var obj = {
					   name: name,
					   status: status,
					   sequence: sequence
				   };

                   model.set(obj);
				   model.save({}, {
					   headers: {
						   mid: mid
					   },
					   success: function (model) {
                           var targetParent = $(e.target).parent();
                           targetParent.siblings().find("span.name").text(obj.name);
                           targetParent.siblings().find("span.status").text(obj.status);
                           targetParent.siblings().find("span").removeClass("hidden").end().find("input, select, a:contains('Cancel'), a:contains('Save')").remove();
                           targetParent.find(".edit").removeClass("hidden").end().find("a:contains('Cancel'), a:contains('Save')").remove();
                           targetParent.find(".delete").removeClass("hidden").end().find("a:contains('Cancel'), a:contains('Save')").remove();
                           $("#addNewStatus").show();
						   //common.checkBackboneFragment("easyErp/Workflows");
					   },
                    error: function (model, xhr) {
    					self.errorNotification(xhr);
                    }
				   });
			   },

			   cancel: function (e) {
				   e.preventDefault();
				   var targetParent = $(e.target).parent();
				   targetParent.siblings().find("span").removeClass("hidden").end().find("input, select, a:contains('Cancel'), a:contains('Save')").remove();
				   targetParent.find(".edit").removeClass("hidden").end().find("a:contains('Cancel'), a:contains('Save')").remove();
				   targetParent.find(".delete").removeClass("hidden").end().find("a:contains('Cancel'), a:contains('Save')").remove();
				   $("#addNewStatus").show();
			   },

			   edit: function (e) {
				   e.preventDefault();
				   var targetParent = $(e.target).parent();
				   $("span").removeClass("hidden");
				   $(".addnew, .SaveCancel").remove();
				   $(".name input, input.nameStatus, select, a:contains('Cancel'), a:contains('Save')").remove();
				   $(".edit").removeClass("hidden");
				   $(".delete").removeClass("hidden");
				   $("#addNewStatus").show();
				   var target = $(e.target);
				   var td = target.parent();
				   var text = "<a href='#'>";
				   var select = $("<select/>");
				   target.closest("div.row").find("span, .edit").addClass("hidden");
				   target.closest("div.row").find("span, .delete").addClass("hidden");
				   td.siblings(".status").append(select);
				   var statusText = td.siblings("div.status").text().trim();
				   this.relatedStatusesCollection.forEach(function (status) {
					   var statusJson = status.toJSON();
					   (statusJson.status == statusText) ?
						   select.append($("<option>").text(statusJson.status).attr('selected', 'selected')) :
						   select.append($("<option>").text(statusJson.status));
				   });

				   td.siblings(".name").append(
					   $("<input maxlength='32'>").val(td.siblings("div.name").text().trim()));
				   td.append(
					   $(text).text("Save").addClass("save"),
					   $(text).text("Cancel").addClass("cancel")
				   );
			   },

			   deleteItems: function (e) {
				   var mid = 39;
				   e.preventDefault();
				   var tr = $(e.target).closest("div.row");
				   var name = tr.find("div.name input").val();
				   var status = tr.find("div.status option:selected").text();
				   var tdName = tr.find("div.name");
				   var id = tdName.data("id");
				   var sequence = tdName.data("sequence");
				   var model = this.collection.get(id);
				   this.collection.url = "/Workflows";
				   var self = this;
				   var answer = confirm("Realy DELETE items ?!");
				   if (answer == true) {
					   model.destroy({
						   headers: {
							   mid: mid
						   },
						   success: function () {
                               $(e.target).parent().parent().remove();
                    		   //common.checkBackboneFragment("easyErp/Workflows", { trigger: true });
						   },
						   error: function (model, xhr) {
    						   self.errorNotification(xhr);
						   }
					   });
				   }
			   },

			   gotoForm: function (e) {
				   App.ownContentType = true;
				   var itemIndex = $(e.target).closest("tr").data("index") + 1;
				   window.location.hash = "#home/content-Workflows/form/" + itemIndex;
			   },

			   chooseSubWorkflowNames: function (e) {
				   alert($(e.target).hasClass("workflow-sub"));

			   },
			   /*chooseWorkflowNames: function (e) {
				   e.preventDefault();
				   this.$(".workflow-sub-list>*").remove();
				   this.$("#details").addClass("active").show();
				   this.$("#workflows").empty();
				   this.$("#workflowNames").html("");
				   $("#addNewStatus").hide();
				   $(e.target).parents(".workflow-list").find(".active").removeClass("active");
				   var wId = "";
				   if ($(e.target).hasClass("workflow")) {
					   $(e.target).parent().addClass("active");
					   wId = $(e.target).text();
				   } else {
					   $(e.target).addClass("active");
					   wId = $(e.target).find("a").text();

				   }
				   var names = [], wName;

				   _.each(this.collection.models, function (model) {
					   if (model.get('wId') == wId && wName != model.get('wName')) {
						   names.push(model.get('wName'));
						   wName = model.get('wId');

					   }
				   }, this);

				   var first = false;
				   var workflowsWname = _.uniq(names);
				   _.each(workflowsWname, function (name) {
					   if (first) {
						   this.$(".workflow-sub-list").append("<li class='active'><a class='workflow-sub' id='" + wName + "' data-id='" + name + "'href='javascript:;'>" + name + "</a></li>");
						   first = false;
					   }
					   else {
						   this.$(".workflow-sub-list").append("<li id='" + name + "' data-id='" + name + "'><a class='workflow-sub' id='" + wName + "' data-id='" + name + "' href='javascript:;'>" + name + "</a></li>");
					   }
				   }, this);
			   },*/
			   updateSequence: function(e){
				   var n = $("#workflows .row").length;
				   for (var i=0;i<n;i++){
					   $("#workflows .row").eq(i).find("div.name").attr("data-sequence",n-i-1);
				   }
			   },
			   chooseWorkflowDetailes: function (e) {
                   e.preventDefault();
                   var self = this;

				   this.$(".workflow-sub-list>*").remove();
				   this.$("#details").addClass("active").show();
				   this.$("#workflows").empty();
				   this.$("#workflowNames").html("");
				   $("#addNewStatus").show();
				   if ($(e.target).hasClass("workflow")) {
					   var wId = $(e.target).text();
					   $(".workflow-list .active").removeClass("active");
					   $(e.target).parent().addClass("active");
				   }
				   var name = $(e.target).data("id");
				   var values = [];

                   this.collection.fetch({
                       success: function(collection){
                           _.each(collection.models, function (model) {
                               if (model.get('wId') == name) {
                                   values.push({ id: model.get("_id"), name: model.get('name'), status: model.get('status'), sequence: model.get('sequence'), color: model.get('color') });
                               }
                           }, this);

                           //this.$("#sub-details").attr("data-id", name).find("#workflows").empty().append($("<thead />").append($("<tr />").append($("<th />").text("Name"), $("<th />").text("Status"), $("<th />"))), $("<tbody/>"));
                           _.each(values, function (value) {
                               this.$("#workflows").append(new ListItemView({ model: value }).render().el);
                           }, self);
                       }
                   });


				   this.$("#workflows").sortable({
					   stop: function (event, ui) {
						   var id = ui.item.find("div.name").attr("id");
						   self.collection.url = "/Workflows";
						   var model = self.collection.get(id);
                           var sequence = 0;
                           if (ui.item.next().hasClass("row")) {
                               sequence = parseInt(ui.item.next().find("div.name").attr("data-sequence")) + 1;
                           }
						   model.save({
							   sequenceStart: parseInt(ui.item.find("div.name").attr("data-sequence")),
							   wId: model.toJSON().wId,
                               sequence: sequence
						   },{
							   patch: true,
							   success: function (model2) {
                                   self.updateSequence();

                                   self.collection.add(model2, { merge: true });
                               }
						   });
					   }
				   });
			   },

			   render: function () {
				   Custom.setCurrentCL(this.collection.models.length);
				   var workflowsWIds = _.uniq(_.pluck(this.collection.toJSON(), 'wId'), false).sort();
				   var workflowsWname = _.uniq(_.pluck(this.collection.toJSON(), 'wName', 'wId'), false);
				   this.$el.html(_.template(ListTemplate, { workflowsWIds: workflowsWIds}));
				   this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");
 
				   return this;
			   },


			   checked: function () {
				   if ($("input:checked").length > 0)
					   $("#top-bar-deleteBtn").show();
				   else
					   $("#top-bar-deleteBtn").hide();
			   },
			   createItem: function () {
				   new CreateView({ collection: this.collection });
			   },

			   editItem: function () {
				   //create editView in dialog here
				   new EditView({ collection: this.collection });
			   },

			   addNewStatus: function (e) {
				   $("span").removeClass("hidden");
				   $(".name input, select, a:contains('Cancel'), a:contains('Save')").remove();
				   $(".edit").removeClass("hidden");
				   $(".delete").removeClass("hidden");
				   e.preventDefault();
				   var mid = 39;
				   e.preventDefault();
				   $("#addNewStatus").hide();
				   $("#workflows").append("<div class='addnew row'><div><input type='text' class='nameStatus' maxlength='32' required /></div><div class='status-edit'><select id='statusesDd'></select></div><div class='SaveCancel'><a href='javascript:;' id='saveStatus'>Save</a><a  href='javascript:;' id='cancelStatus'>Cancel</a></div></div>");
				   var targetParent = $(e.target).parent();
				   var target = $(e.target);
				   var td = target.parent();
				   var text = "<a href='#'>";
				   this.relatedStatusesCollection.forEach(function (status) {
					   var statusJson = status.toJSON();
					   $("#statusesDd").append($("<option>").text(statusJson.status));
				   });

			   },
			   cancelStatus: function (e) {
				   e.preventDefault();
				   $(".addnew, .SaveCancel").remove();
				   $("#addNewStatus").show();
			   },

			   saveStatus: function (e) {
				   e.preventDefault();
				   var mid = 39;
				   var workflowsModel = new WorkflowsModel();
				   var wId = $(".workflow-list li.active").text();
				   var workflowCollection = this.collection.toJSON();
				   var self = this;
				   
                   var workflowArray = _.filter(workflowCollection, function (workflow) {
                       if (workflow.wId == wId) {
                           return workflow;
                       }
                   });
                   var length = workflowArray.length;
                   
				   //var name = $(".workflow-sub-list li.active a").text();

				   var name = $.trim($(".nameStatus").val());
                   var status = $("#statusesDd option:selected").val();

				   workflowsModel.save({
                         wId: wId,
                         name: name,
                         status: status,
                         sequence: length
				   },
                   {
					   headers: {
						    mid: mid
					   },
                       validate:true,
                       success: function (model, response) {
                           //common.checkBackboneFragment("easyErp/Workflows");
                           model.set('_id',response.createdModel._id);
                           model.set('color',response.createdModel.color);
                           var newModel = {
                               id: response.createdModel._id,
                               name: response.createdModel.name,
                               status: response.createdModel.status,
                               sequence: response.createdModel.sequence,
                               color: response.createdModel.color,
                               wId: response.createdModel.wId
                           };
                           self.collection.add(workflowsModel);
                           $("#workflows").prepend(new ListItemView({ model: newModel }).render().el);
                           $(".addnew, .SaveCancel").remove();
                           $("#addNewStatus").show();
                       },
                       error: function (model, xhr) {
                            self.errorNotification(xhr);
                       }
				   });
			   },

			   cancelAll:function(e) {
				   e.preventDefault();
				   $(".save-status").remove();
				   $(".wNameEdit").remove();
				   $("li").find("a.workflow-sub").show();
				   $(".quickEdit").removeClass();
			   },

			   editAll: function(e){
				   e.preventDefault();
				   $(".save-status").remove();
				   $(".wNameEdit").remove();
				   $("li").find("a.workflow-sub").show();
				   $(".quickEdit").removeClass();
				   var targetInput = $(e.target).parent();
				   // targetInput.closest("li").find("span, .edit").hide();
				   var text = targetInput.closest("li").find("a.workflow-sub").text();
				   targetInput.closest("li").find("a.workflow-sub").hide();
				   targetInput.closest("li").addClass("quickEdit")
				   targetInput.closest("li").find("span").hide();
				   targetInput.closest("li").append(
                       $("<input class='wNameEdit' maxlength='32' type='text' value = '"+text+"' required />")
				   );
				   targetInput.closest("li").append("<span class='save-status'><a href='#' class='saveAll'>Save</a><a href='#' class='cancelAll'>Cancel</a></span>");
				   
			   },
			   
			   quickEdit:function(e){
			   var n = $("#workflows .row").length;
			   if (n == 1) {
                    $("a.delete").remove();
			        }
			   },
			   removeEdit:function(){
        		   $(".edit-holder").remove();
			   },
			   
			   deleteAll: function(e){
				   e.preventDefault();
				   var wId = $(e.target).parent().attr("id");
				   var mid = 39;
				   var targetInput = $(e.target).parent();
				   var wName = targetInput.closest("li").find("a.workflow-sub").text();
				   var answer = confirm("Realy DELETE items ?!");
				   if (answer == true) {
            		   this.collection.url = "/Workflows";
            		   _.each(this.collection.models, function (model) {
						   if ((model.get('wName')) == wName){
                               model.destroy({
                                   headers: {
                                       mid: mid
                                   },
                                   success: function () {
                                	   common.checkBackboneFragment("easyErp/Workflows", { trigger: true });
                                   },
                                   error: function () {
                                       Backbone.history.navigate("easyErp", { trigger: true });
                                   }
                               });
							   
						   }
					   }, this);
				   }
			   },
			   
			   saveAll:function(e, options){  	
        		   e.preventDefault();
				   var mid = 39;
				   var targetInput = $(e.target).parent();
				   var wName = targetInput.closest("li").find("a.workflow-sub").text();
				   this.collection.url = "/Workflows";
				   var model = new WorkflowsModel();
				   _.each(this.collection.models, function (model) {
            		   if ((model.get('wName')) == wName){
                    	   var new_wname = $(".wNameEdit").val();
                    	   
	                       model.set('wName', new_wname, {validate : true});
	                       model.save({},{
	                           headers: {
	                               mid: mid
	                           },
	                           success: function (model, response, options) {
	                               common.checkBackboneFragment("easyErp/Workflows");
	                           }
	                       });
                       }
				   }, this);
			   }
		   });

		   return ContentView;
	   });



