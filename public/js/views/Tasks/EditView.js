﻿define([
    "text!templates/Tasks/EditTemplate.html",
    "text!templates/Notes/AddAttachments.html",
    "common",
    'text!templates/Notes/AddNote.html',
    "populate"
],
       function (EditTemplate,addAttachTemplate, common,addNoteTemplate, populate) {

           var EditView = Backbone.View.extend({
               contentType: "Tasks",
               template: _.template(EditTemplate),
               initialize: function (options) {
                   _.bindAll(this, "render", "saveItem");
                   _.bindAll(this, "render", "deleteItem");
                   this.currentModel = (options.model) ? options.model : options.collection.getElement();
				   this.responseObj = {}
                   this.render();
               },

               events: {
                   "click #tabList a": "switchTab",
                   "click .breadcrumb a, #Cancel span, #Done span": "changeWorkflow",
                   "change #workflowDd": "changeWorkflowValues",
                   'keydown': 'keydownHandler',
                   "click .current-selected": "showNewSelect",
                   "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                   "click .newSelectList li.miniStylePagination": "notHide",
                   "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                   "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                   "click": "hideNewSelect",
				   "click #projectTopName":"hideDialog",
				   "click .deleteAttach": "deleteAttach",
	               "change .inputAttach": "addAttach",
	               "click #addNote": "addNote",
                   "click .editDelNote": "editDelNote",
                   "click #cancelNote": "cancelNote",
                   "click #noteArea" : "expandNote",
                   "click #cancelNote" : "cancelNote",
                   "click .addTitle" : "showTitle",
                   "click .editNote" : "editNote",
	           },
	           
	           cancelNote: function (e) {
                   $('#noteArea').val('');
                   $('#noteTitleArea').val('');
                   $('#getNoteKey').attr("value", '');
               },
               editDelNote: function (e) {
                   var id = e.target.id;
                   var k = id.indexOf('_');
                   var type = id.substr(0, k);
                   var id_int = id.substr(k + 1);
                   var currentModel =  this.currentModel;
                   var notes = currentModel.get('notes');

                   switch (type) {
                   case "edit": {
                       $('#noteArea').val($('#' + id_int).find('.noteText').text());
                       $('#noteTitleArea').val($('#' + id_int).find('.noteTitle').text());
                       $('#getNoteKey').attr("value", id_int);
                       break;
                   }
                   case "del": {
					   
                       var new_notes = _.filter(notes, function (note) {
                           if (note._id != id_int) {
                               return note;
                           }
                       });
                       currentModel.save({'notes': new_notes},
										 {
											 headers: {
												 mid: 40,
												 remove: true,
											 },
											 
											 success: function (model, response, options) {
												 $('#' + id_int).remove();
											 }
										 });
                       break;
                   }
				   }
               },
			   hideNewSelect:function(e){
				   $(".newSelectList").hide();;
			   },
               addNote: function (e) {
            	   e.preventDefault();
                   var val = $('#noteArea').val().replace(/</g,"&#60;").replace(/>/g,"&#62;");
                   var title = $('#noteTitleArea').val().replace(/</g,"&#60;").replace(/>/g,"&#62;");
                   if (val || title) {
                	   var currentModel =  this.currentModel;
                	   var notes = currentModel.get('notes');
                       var arr_key_str = $('#getNoteKey').attr("value");
                       var note_obj = {
                           note: '',
                           title: ''
                       };
                       if (arr_key_str) {
                           var edit_notes = _.filter(notes, function (note) {
                               if (note._id == arr_key_str) {
                                   note.note = val;
                                   note.title = title;
                                   return note;
                               }
                           });
                           currentModel.save({ 'notes': editNotes },
											 {
												 headers: {
													 mid: 40
												 },
												 patch: true,
												 success: function (model, response, options) {
													 $('#noteBody').val($('#' + arr_key_str).find('.noteText').html(val));
													 $('#noteBody').val($('#' + arr_key_str).find('.noteTitle').html(title));
													 $('#getNoteKey').attr("value", '');
												 }
											 });



                       } else {

                           note_obj.note = val;
                           note_obj.title = title;
                           notes.push(note_obj);
                           currentModel.set();
                           currentModel.save({'notes': notes},
											 {
												 headers: {
													 mid: 40
												 },
												 patch: true,
												 wait: true,
												 success: function (models,data,response) {

            										 $('#noteBody').empty();
            										 data.notes.forEach(function(item){
            											 var date = common.utcDateToLocaleDate(item.date);
            											 //notes.push(item);
            											 $('#noteBody').prepend(_.template(addNoteTemplate, { id: item._id, title:item.title, val:item.note, author:item.author, date: date }));
            										 });
												 }
											 });

                       }
                       $('#noteArea').val('');
                       $('#noteTitleArea').val('');
                   }
               },
               
               editNote : function(e){
    			   $(".title-wrapper").show();
    			   $("#noteArea").attr("placeholder","").parents(".addNote").addClass("active");
    		   },
    		   expandNote : function(e){
    			   if (!$(e.target).parents(".addNote").hasClass("active")){
    				   $(e.target).attr("placeholder","").parents(".addNote").addClass("active");
    				   $(".addTitle").show();
    			   }
               },
    		   cancelNote : function(e){
    			   $(e.target).parents(".addNote").find("#noteArea").attr("placeholder","Add a Note...").parents(".addNote").removeClass("active");
    			   $(".title-wrapper").hide();
    			   $(".addTitle").hide();
               },

    		   saveNote : function(e){
    			   if (!($(e.target).parents(".addNote").find("#noteArea").val()=="" && $(e.target).parents(".addNote").find("#noteTitleArea").val()=="")){
    				   $(e.target).parents(".addNote").find("#noteArea").attr("placeholder","Add a Note...").parents(".addNote").removeClass("active");
    				   $(".title-wrapper").hide();
    				   $(".addTitle").hide();
    			   }
    			   else{
    				   $(e.target).parents(".addNote").find("#noteArea").focus();
    			   }
               },

    		   showTitle : function(e){
    			   $(e.target).hide().parents(".addNote").find(".title-wrapper").show().find("input").focus();
               },

		       
		       fileSizeIsAcceptable: function(file){
		           if(!file){return false;}
		           return file.size < App.File.MAXSIZE;
		       },
		       addAttach: function (event) {
		           event.preventDefault();
		           var currentModel = this.currentModel;
		           var currentModelID = currentModel["id"];
		           var addFrmAttach = $("#editTaskForm");
		           var addInptAttach = $(".input-file .inputAttach")[0].files[0];
		           if(!this.fileSizeIsAcceptable(addInptAttach)){
		               alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
		               return;
		           }
		           addFrmAttach.submit(function (e) {
		               var bar = $('.bar');
		               var status = $('.progress_status');
		               var formURL = "http://" + window.location.host + "/uploadTasksFiles";
		               e.preventDefault();
		               addFrmAttach.ajaxSubmit({
		                   url: formURL,
		                   type: "POST",
		                   processData: false,
		                   contentType: false,
		                   data: [addInptAttach],

		                   beforeSend: function (xhr) {
		                       xhr.setRequestHeader("id", currentModelID);
		                       status.show();
		                       var statusVal = '0%';
		                       bar.width(statusVal);
		                       status.html(statusVal);
		                   },
		                   
		                   uploadProgress: function(event, position, total, statusComplete) {
		                       var statusVal = statusComplete + '%';
		                       bar.width(statusVal);
		                       status.html(statusVal);
		                   },
		                   
		                   success: function (data) {
		                       var attachments = currentModel.get('attachments');
		  					   attachments.length=0;
							   $('.attachContainer').empty();
							   data.attachments.forEach(function(item){
								   var date = common.utcDateToLocaleDate(item.uploadDate);
								   attachments.push(item);
								   $('.attachContainer').prepend(_.template(addAttachTemplate, { data: item, date: date }));
							   });
		                       console.log('Attach file');
		                       addFrmAttach[0].reset();
		                       status.hide();
		                   },

		                   error: function () {
		                       console.log("Attach file error");
		                   }
		               });
				   })
				   addFrmAttach.submit();
				   addFrmAttach.off('submit');
			   },
			   
			   deleteAttach: function (e) {
				   if ($(e.target).closest("li").hasClass("attachFile")){
					   $(e.target).closest(".attachFile").remove();
				   }
				   else{
					   var id = e.target.id;
					   var currentModel = this.currentModel;
					   var attachments = currentModel.get('attachments');
					   var new_attachments = _.filter(attachments, function (attach) {
						   if (attach._id != id) {
							   return attach;
						   }
					   });
					   currentModel.save({'attachments': new_attachments},
										 {
											 headers: {
												 mid: 39
											 },
											 
											 patch: true,//Send only changed attr(add Roma)
											 success: function (model, response, options) {
												 $('.attachFile_' + id).remove();
											 }
										 });
				   }
			   },
			   chooseOption: function (e) {
				   $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id",$(e.target).attr("id"));
			   },
               keydownHandler: function(e){
                   switch (e.which){
                   case 27:
                       this.hideDialog();
                       break;
                   default:
                       break;
                   }
               },

               hideDialog: function () {
                   $(".edit-dialog").remove();
               },

               changeWorkflow: function (e) {
                   var mid = 39;
                   var model = {};
                   var name = '', status = '';
                   if ($(e.target).hasClass("applicationWorkflowLabel")) {
                       var breadcrumb = $(e.target).closest('li');
                       var a = breadcrumb.siblings().find("a");
                       if (a.hasClass("active")) {
                           a.removeClass("active");
                       }
                       breadcrumb.find("a").addClass("active");
                       name = breadcrumb.data("name");
                       status = breadcrumb.data("status");
                   } else {
                       var workflow = {};
                       var length = this.workflowsDdCollection.models.length;
                       if ($(e.target).closest("button").attr("id") == "Cancel") {
                           workflow = this.workflowsDdCollection.models[length - 1];
                       }
                       else {
                           workflow = this.workflowsDdCollection.models[length - 2];
                       }
                       name = workflow.get('name');
                       status = workflow.get('status');
                   }
                   model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                   var ob = {
                       workflow: {
                           name: name,
                           status: status
                       }
                   };

                   model.set(ob);
                   model.save({}, {
                       headers: {
                           mid: mid
                       }
                   });

               },

               switchTab: function (e) {
                   e.preventDefault();
                   var link = this.$("#tabList a");
                   if (link.hasClass("selected")) {
                       link.removeClass("selected");
                   }
                   var index = link.index($(e.target).addClass("selected"));
                   this.$(".tab").hide().eq(index).show();
               },

               saveItem: function (event) {
                   event.preventDefault();
                   var self = this;

                   var mid = 39;
                   var summary = $.trim(this.$el.find("#summary").val());
                   var project = $("#projectDd").data("id");
                   var assignedTo = $("#assignedToDd").data("id");

                   var tags = $.trim($("#tags").val()).split(',');
                   if (tags.length == 0) {
                       tags = null;
                   }

                   var sequence = $.trim(this.$el.find("#sequence").val());
                   if (!sequence) {
                       sequence = null;
                   }
                   var workflow = $("#workflowsDd").data("id");
                   var estimated = $.trim(this.$el.find("#estimated").val());
                   if ($.trim(estimated) == "") {
                       estimated = 0;
                   }

                   var logged = $.trim(this.$el.find("#logged").val());

                   var priority = $("#priorityDd").data("id");

                   var data = {
                       type: $("#type").data("id"),
                       summary: summary,
                       assignedTo: assignedTo ? assignedTo : null,
                       workflow: workflow ? workflow : null,
                       project: project,
                       tags: tags,
                       deadline: $.trim(this.$el.find("#deadline").val()),
                       description: $.trim(this.$el.find("#description").val()),
                       extrainfo: {
                           priority: priority,
                           sequence: sequence,
                           StartDate: $.trim(this.$el.find("#StartDate").val())
                       },
                       estimated: estimated,
                       logged: logged
                   };


                   this.currentModel.save(data, {
                       headers: {
                           mid: mid
                       },
                       wait: true,
                       success: function (model) {
                           model = model.toJSON();
                           self.hideDialog();
                           if (!model.project) {
                               Backbone.history.navigate("easyErp/Tasks/kanban", { trigger: true });

                           } else {
                               Backbone.history.navigate("easyErp/Tasks", { trigger: true });
                           }
                       },
                       error: function (model, xhr, options) {
                           Backbone.history.navigate("easyErp", { trigger: true });
                       }
                   });

               },

               changeWorkflowValues: function () {
                   this.$("#workflowValue").html("");
                   var that = this;
                   var choosedWorkflow = _.filter(that.workflows, function (workflow) {
                       return workflow.wId == that.$("#workflowDd option:selected").val();
                   });
                   console.log(this.currentModel.get('workflow')._id);
                   _.each(choosedWorkflow, function (value,key) {
                       this.currentModel.get('workflow')._id === value._id ?
						   this.$("#workflowValue").append( $('<option/>').val(value._id).text(value.name + " (" + value.status + ")" ).attr('selected', 'selected')):
						   this.$("#workflowValue").append( $('<option/>').val(value._id).text(value.name + " (" + value.status + ")" ));
                   },this);
               },

               notHide: function (e) {
				   return false;
               },

			   nextSelect:function(e){
				   this.showNewSelect(e,false,true)
			   },
			   prevSelect:function(e){
				   this.showNewSelect(e,true,false)
			   },
               showNewSelect:function(e,prev,next){
                   populate.showSelect(e,prev,next,this);
                   return false;
			   },
               deleteItem: function(event) {
                   var mid = 39;
                   event.preventDefault();
                   var self = this;
                   var answer = confirm("Realy DELETE items ?!");
                   if (answer == true) {
                       this.currentModel.destroy({
                           headers: {
                               mid: mid
                           },
                           success: function () {
                               $('.edit-dialog').remove();
                               Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                           },
                           error: function () {
                               $('.edit-dialog').remove();
                               Backbone.history.navigate("home", { trigger: true });
                           }
                       });
                   }
               },
               render: function () {
                   var formString = this.template({
                       model: this.currentModel.toJSON()
                   });
                   var self = this;
                   this.$el = $(formString).dialog({
                       dialogClass: "edit-dialog",
                       width: 600,
                       title: this.currentModel.toJSON().project.projectShortDesc,
                       buttons:{
                           save:{
                               text: "Save",
                               class: "btn",
                               click: self.saveItem
                           },
                           cancel:{
                               text: "Cancel",
                               class: "btn",
                               click: self.hideDialog
                           },
                           delete:{
                               text: "Delete",
                               class: "btn",
                               click: self.deleteItem
                           }
                       }
                   });
				   populate.get("#projectDd","/getProjectsForDd",{},"projectName",this);
				   populate.getWorkflow("#workflowsDd","#workflowNamesDd","/WorkflowsForDd",{id:"Tasks"},"name",this);
				   populate.get2name("#assignedToDd", "/getPersonsForDd",{},this);
				   populate.getPriority("#priorityDd",this);				
                   this.delegateEvents(this.events);
                   $('#StartDate').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                   $('#deadline').datepicker({
                       dateFormat: "d M, yy",
                       changeMonth: true,
                       changeYear: true,
                       minDate: new Date()
                   });
                   $("#ui-datepicker-div").addClass("createFormDatepicker");
                   return this;
               }

           });
           return EditView;
       });
