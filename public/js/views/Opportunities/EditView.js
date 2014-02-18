define([
    "text!templates/Opportunities/EditTemplate.html",
    "text!templates/Opportunities/editSelectTemplate.html",
    'text!templates/Notes/AddAttachments.html',
    'text!templates/Notes/AddNote.html',
    "common",
    "custom",
	"populate"
],
       function (EditTemplate, editSelectTemplate,addAttachTemplate, addNoteTemplate, common, custom, populate) {

           var EditView = Backbone.View.extend({
               el: "#content-holder",
               contentType: "Opportunities",
               template: _.template(EditTemplate),

               initialize: function (options) {
            	   _.bindAll(this, "render", "saveItem", "deleteItem");
                   this.currentModel = options.model;
                   this.page=1;
                   this.pageG=1;
				   this.responseObj = {};
                   this.render();
               },

               events: {
                   "click .breadcrumb a, #lost, #won": "changeWorkflow",
                   "click #tabList a": "switchTab",
                   "change #customer": "selectCustomer",
                   'keydown': 'keydownHandler',
                   'click .dialog-tabs a': 'changeTab',
                   'click .addUser': 'addUser',
                   'click .addGroup': 'addGroup',
                   'click .unassign': 'unassign',
                   'click #targetUsers li': 'chooseUser',
                   'click #addUsers':'addUsers',
                   'click #removeUsers':'removeUsers',
                   "click .deleteAttach": "deleteAttach",
                   "change .inputAttach": "addAttach",
                   "click #addNote": "addNote",
                   "click .editDelNote": "editDelNote",
                   "click #cancelNote": "cancelNote",
                   "click #noteArea": "expandNote",
                   "click .addTitle": "showTitle",
                   "click .editNote": "editNote",
                   "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                   "click .newSelectList li.miniStylePagination": "notHide",
                   "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                   "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                   "click .current-selected": "showNewSelect",
                   "click": "hideNewSelect"

               },
			   notHide: function () {
				   return false;
               },
               hideNewSelect: function () {
                   $(".newSelectList").hide();
               },
			   nextSelect:function(e){
				   this.showNewSelect(e,false,true);
			   },
			   prevSelect:function(e){
				   this.showNewSelect(e,true,false);
			   },
               showNewSelect:function(e,prev,next){
                   populate.showSelect(e,prev,next,this);
                   return false;
               },
			   chooseOption:function(e){
                   $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id",$(e.target).attr("id"));
			   },

               changeTab:function(e){
                   var holder = $(e.target);
                   holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                   holder.addClass("active");
                   var n= holder.parents(".dialog-tabs").find("li").index(holder.parent());
                   var dialog_holder = $(".dialog-tabs-items");
                   dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                   dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
               },
               addUser:function(){
                   var self = this;
                   $(".addUserDialog").dialog({
                       dialogClass: "add-user-dialog",
                       width: "900px",
                       buttons:{
                           save:{
                               text:"Choose",
                               class:"btn",

                               click: function(){
                                   self.addUserToTable("#targetUsers");
                                   $( this ).dialog( "close" );
                               }

                           },
                           cancel:{
                               text:"Cancel",
                               class:"btn",
                               click: function(){
                                   $( this ).dialog( "close" );
                               }
                           }
                       }

                   });
                   $("#targetUsers").unbind().on("click","li",this.removeUsers);
                   $("#sourceUsers").unbind().on("click","li",this.addUsers);
                   $(document).on("click",".nextUserList",function(e){
                       self.page += 1;
                       self.nextUserList(e,self.page);
                   });
                   $(document).on("click",".prevUserList",function(e){
                       self.page -= 1;
                       self.prevUserList(e,self.page);
                   });

               },
               addGroup:function(){
                   var self = this;
                   $(".addGroupDialog").dialog({
                       dialogClass: "add-group-dialog",
                       width: "900px",
                       buttons:{
                           save:{
                               text:"Choose",
                               class:"btn",
                               click: function(){
                                   self.addUserToTable("#targetGroups");
                                   $( this ).dialog( "close" );
                               }
                           },
                           cancel:{
                               text:"Cancel",
                               class:"btn",
                               click: function(){
                                   $( this ).dialog( "close" );
                               }
                           }
                       }

                   });
                   $("#targetGroups").unbind().on("click","li",this.removeUsers);
                   $("#sourceGroups").unbind().on("click","li",this.addUsers);
                   $(document).unbind().on("click",".nextGroupList",function(e){
                       self.pageG += 1;
                       self.nextUserList(e,self.pageG);
                   });
                   $(document).unbind().on("click",".prevGroupList",function(e){
                       self.pageG -= 1;
                       self.prevUserList(e,self.pageG);
                   });
               },
               addUsers: function (e) {
                   e.preventDefault();
                   $(e.target).closest(".ui-dialog").find(".target").append($(e.target));

               },
               removeUsers: function (e) {
                   e.preventDefault();
                   $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
               },
               unassign:function(e){
                   var holder = $(e.target);
                   var id = holder.closest("tr").data("id");
                   var type = holder.closest("tr").data("type");
                   var text = holder.closest("tr").find("td").eq(0).text();
                   $("#"+type).append("<option value='"+id+"'>"+text+"</option>");
                   holder.closest("tr").remove();
                   var groupsAndUser = $(".groupsAndUser");
                   if (groupsAndUser.find("tr").length==1){
                       groupsAndUser.hide();
                   }
               },
               chooseUser:function(e){
                   $(e.target).toggleClass("choosen");
               },
               addUserToTable:function(id){
                   var groupsAndUser_holder = $(".groupsAndUser");
                   var groupsAndUserHr_holder = $(".groupsAndUser tr");
                   groupsAndUser_holder.show();
                   groupsAndUserHr_holder.each(function(){
                       if ($(this).data("type")==id.replace("#","")){
                           $(this).remove();
                       }
                   });
                   $(id).find("li").each(function(){
                       groupsAndUser_holder.append("<tr data-type='"+id.replace("#","")+"' data-id='"+ $(this).attr("id")+"'><td>"+$(this).text()+"</td><td class='text-right'></td></tr>");
                   });
                   if (groupsAndUserHr_holder.length<2){
                       groupsAndUser_holder.hide();
                   }
               },
               keydownHandler: function (e) {
                   switch (e.which) {
                   case 27:
                       this.hideDialog();
                       break;
                   default:
                       break;
                   }
               },

			   
               getWorkflowValue: function (value) {
                   var workflows = [];
                   for (var i = 0; i < value.length; i++) {
                       workflows.push({ name: value[i].name, status: value[i].status });
                   }
                   return workflows;
               },

               selectCustomer: function (e) {
                   e.preventDefault();
                   var id = $(e.target).val();
                   var customer = this.customersCollection.get(id).toJSON();
                   if (customer.type == 'Person') {
                       this.$el.find('#company').val(customer.company.name);
                   } else {
                       this.$el.find('#company').val(customer.name);
                   }
                   this.$el.find('#email').val(customer.email);
                   this.$el.find('#phone').val(customer.phones.phone);
                   this.$el.find('#mobile').val(customer.phones.mobile);
                   this.$el.find('#street').val(customer.address.street);
                   this.$el.find('#city').val(customer.address.city);
                   this.$el.find('#state').val(customer.address.state);
                   this.$el.find('#zip').val(customer.address.zip);
                   this.$el.find('#country').val(customer.address.country);
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
               //Notes (add Vasya)
               editDelNote: function (e) {
                   var id = e.target.id;
                   var k = id.indexOf('_');
                   var type = id.substr(0, k);
                   var id_int = id.substr(k + 1);
                   var currentModel = this.currentModel;
                   var notes = currentModel.get('notes');

                   switch (type) {
                   case "edit": {
                       var id_int_holder = $('#' + id_int);
                       $('#noteArea').val(id_int_holder.find('.noteText').text());
                       $('#noteTitleArea').val(id_int_holder.find('.noteTitle').text());
                       $('#getNoteKey').attr("value", id_int);
                       break;
                   }
                   case "del": {
                       var newNotes = _.filter(notes, function (note) {
                           if (note._id != id_int) {
                               return note;
                           }
                       });
                       currentModel.save({ 'notes': newNotes },
										 {
											 headers: {
												 mid: 39
											 },
											 patch: true,
											 success: function () {
												 $('#' + id_int).remove();
											 }
										 });
                       break;
                   }
                   }
               },

               addNote: function (e) {
                   e.preventDefault();
                   var noteArea_holder = $('#noteArea');
                   var noteTitleArea_holder = $('#noteTitleArea');
                   var val = noteArea_holder.val().replace(/</g, "&#60;").replace(/>/g, "&#62;");
                   var title = noteTitleArea_holder.val().replace(/</g, "&#60;").replace(/>/g, "&#62;");
                   if (val || title) {
                       var notes = this.currentModel.get('notes');
                       var arrKeyStr = $('#getNoteKey').attr("value");
                       var noteObj = {
                           note: '',
                           title: ''
                       };
                       if (arrKeyStr) {
                           var editNotes = _.map(notes, function (note) {
                               if (note._id == arrKeyStr) {
                                   note.note = val;
                                   note.title = title;
                               }
                               return note;
                           });
                           this.currentModel.save({ 'notes': editNotes },
												  {
													  headers: {
														  mid: 39
													  },
													  patch: true,
													  success: function () {
														  var arrKeyStr_holder = $('#' + arrKeyStr);
														  var noteBody_holder = $('#noteBody');
														  noteBody_holder.val(arrKeyStr_holder.find('.noteText').html(val));
														  noteBody_holder.val(arrKeyStr_holder.find('.noteTitle').html(title));
														  $('#getNoteKey').attr("value", '');
													  }
												  });
                       } else {
                           noteObj.note = val;
                           noteObj.title = title;
                           notes.push(noteObj);
                           this.currentModel.save({ 'notes': notes },
												  {
													  headers: {
														  mid: 39
													  },
													  patch: true,
													  success: function (models, data) {
														  $('#noteBody').empty();
														  data.result.notes.forEach(function (item) {
															  var date = common.utcDateToLocaleDate(item.date);
															  $('#noteBody').prepend(_.template(addNoteTemplate, { id: item._id, title: item.title, val: item.note, author: item.author, date: date }));
														  });
													  }
												  });
                       }
                       noteArea_holder.val('');
                       noteTitleArea_holder.val('');
                   }
               },

               editNote: function () {
                   $(".title-wrapper").show();
                   $("#noteArea").attr("placeholder", "").parents(".addNote").addClass("active");
               },

               expandNote: function (e) {
                   if (!$(e.target).parents(".addNote").hasClass("active")) {
                       $(e.target).attr("placeholder", "").parents(".addNote").addClass("active");
                       $(".addTitle").show();
                   }
               },

               cancelNote: function (e) {
                   $(e.target).parents(".addNote").find("#noteArea").attr("placeholder", "Add a Note...").parents(".addNote").removeClass("active");
                   $(".title-wrapper").hide();
                   $(".addTitle").hide();
               },

               saveNote: function (e) {
                   if (!($(e.target).parents(".addNote").find("#noteArea").val() == "" && $(e.target).parents(".addNote").find("#noteTitleArea").val() == "")) {
                       $(e.target).parents(".addNote").find("#noteArea").attr("placeholder", "Add a Note...").parents(".addNote").removeClass("active");
                       $(".title-wrapper").hide();
                       $(".addTitle").hide();
                   }
                   else {
                       $(e.target).parents(".addNote").find("#noteArea").focus();
                   }
               },

               showTitle: function (e) {
                   $(e.target).hide().parents(".addNote").find(".title-wrapper").show().find("input").focus();
               },
               //attachments (add Vasya)
               fileSizeIsAcceptable: function (file) {
                   if (!file) { return false; }
                   return file.size < App.File.MAXSIZE;
               },

               addAttach: function (event) {
                   event.preventDefault();
                   var currentModel = this.currentModel;
                   var currentModelID = currentModel["id"];
                   var addFrmAttach = $("#editOpportunities");
                   var addInptAttach = $(".input-file .inputAttach")[0].files[0];
                   if (!this.fileSizeIsAcceptable(addInptAttach)) {
                       alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                       return;
                   }
                   addFrmAttach.submit(function (e) {
                       e.preventDefault();
                       var bar = $('.bar');
                       var status = $('.progress_status');
                       var formURL = "http://" + window.location.host + "/uploadOpportunitiesFiles";
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

                           uploadProgress: function (event, position, total, statusComplete) {
                               var statusVal = statusComplete + '%';
                               bar.width(statusVal);
                               status.html(statusVal);
                           },

                           success: function (data) {
                               var attachments = currentModel.get('attachments');
                               attachments.length = 0;
                               $('.attachContainer').empty();

                               data.result.attachments.forEach(function (item) {
                                   var date = common.utcDateToLocaleDate(item.uploadDate);
                                   attachments.push(item);
                                   $('.attachContainer').prepend(_.template(addAttachTemplate, { data: item, date: date }));
                               });
                               addFrmAttach[0].reset();
                               status.hide();
                           },

                           error: function (model, xhr) {
                               alert(xhr.status);
                           }
                       });
                   });
                   addFrmAttach.submit();
                   addFrmAttach.off('submit');
               },

               deleteAttach: function (e) {
                   var target = $(e.target);
                   if (target.closest("li").hasClass("attachFile")) {
                       target.closest(".attachFile").remove();
                   } else {
                       var id = e.target.id;
                       var currentModel = this.currentModel;
                       var attachments = currentModel.get('attachments');
                       var newAttachments = _.filter(attachments, function (attach) {
                           if (attach._id != id) {
                               return attach;
                           }
                       });
                       currentModel.save({ 'attachments': newAttachments },
										 {
											 headers: {
												 mid: 39
											 },
											 patch: true,
											 success: function () {
												 $('.attachFile_' + id).remove();
											 }
										 });
                   }
               },

               saveItem: function () {
                   var self = this;

                   var mid = 39;

                   var name = $.trim($("#name").val());
                   var viewType = custom.getCurrentVT();
                   var expectedRevenueValue = $.trim($("#expectedRevenueValue").val());
                   var expectedRevenueProgress = $.trim($("#expectedRevenueProgress").val());
                   if (expectedRevenueValue || expectedRevenueProgress) {
                       var expectedRevenue = {
                           value: expectedRevenueValue,
                           currency: '$',
                           progress: expectedRevenueProgress
                       };
                   }

                   var customerId = this.$("#customerDd").data("id");
                   customerId = customerId ? customerId : null;

                   var email = $.trim($("#email").val());

                   var salesPersonId = this.$("#salesPersonDd").data("id");
                   salesPersonId = salesPersonId ? salesPersonId : null;

                   var salesTeamId = this.$("#salesTeamDd").data("id");
                   salesTeamId = salesTeamId ? salesTeamId : null;

                   var nextActionDate = $.trim(this.$el.find("#nextActionDate").val());
                   var nextActionDescription = $.trim(this.$el.find("#nextActionDescription").val());
                   /*var nextActionDate = "";
                     if (nextActionSt) {
                     nextActionDate = $.trim($("#nextActionDate").val());
                     };*/
                   var nextAction = {
                       date: nextActionDate,
                       desc: nextActionDescription
                   };

                   var expectedClosing = $.trim(this.$el.find("#expectedClosing").val());
                   //var expectedClosing = "";
                   /*if (expectedClosingSt){
                     expectedClosing = $.trim($("#expectedClosing").val());
                     };*/

                   var priority = $("#priorityDd").text();

                   var internalNotes = $.trim($("#internalNotes").val());

                   var address = {};
                   $("dd").find(".address").each(function () {
                       var el = $(this);
                       address[el.attr("name")] = el.val();
                   });

                   var first = $.trim($("#first").val());
                   var last = $.trim($("#last").val());
                   var contactName = {
                       first: first,
                       last: last
                   };

                   var func = $.trim($("#func").val());

                   var phone = $.trim($("#phone").val());
                   var mobile = $.trim($("#mobile").val());
                   var fax = $.trim($("#fax").val());
                   var phones = {
                       phone: phone,
                       mobile: mobile,
                       fax: fax
                   };

                   var workflow = this.$("#workflowDd").data("id");
                   workflow = workflow ? workflow : null;

                   var active = ($("#active").is(":checked")) ? true : false;

                   var optout = ($("#optout").is(":checked")) ? true : false;

                   var reffered = $.trim($("#reffered").val());

                   var usersId=[];
                   var groupsId=[];
                   $(".groupsAndUser tr").each(function(){
                       if ($(this).data("type")=="targetUsers"){
                           usersId.push($(this).data("id"));
                       }
                       if ($(this).data("type")=="targetGroups"){
                           groupsId.push($(this).data("id"));
                       }

                   });
                   var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
				   var data ={
                       name: name,
                       expectedRevenue: expectedRevenue,
                       customer: customerId,
                       email: email,
                       salesPerson: salesPersonId,
                       salesTeam: salesTeamId,
                       nextAction: nextAction,
                       expectedClosing: expectedClosing,
                       priority: priority,
                       internalNotes: internalNotes,
                       address: address,
                       contactName: contactName,
                       func: func,
                       phones: phones,
                       active: active,
                       optout: optout,
                       reffered: reffered,
                       groups: {
                           owner: $("#allUsers").val(),
                           users: usersId,
                           group: groupsId
                       },
                       whoCanRW: whoCanRW
                   };
				   var currentWorkflow = this.currentModel.get('workflow');
                if (currentWorkflow._id && (currentWorkflow._id != workflow)) {
                    data['workflow'] = workflow;
                    data['sequence'] = -1;
                    data['sequenceStart'] =  this.currentModel.toJSON().sequence;
                    data['workflowStart'] = currentWorkflow._id;
                };
                   this.currentModel.save(data, {
                       headers: {
                           mid: mid
                       },
					   patch:true,
                       success: function (model, result) {
                        model = model.toJSON();
						result = result.result;
                        var editHolder = self.$el;
						switch (viewType) {
                        case 'list':
                            {
								var tr_holder = $("tr[data-id='" + model._id + "'] td");
                                tr_holder.eq(3).text(name);
                                tr_holder.eq(4).text(expectedRevenueValue);
                                tr_holder.eq(5).text(self.$("#customerDd option:selected").text());
                                tr_holder.eq(6).text(nextAction.date);
                                tr_holder.eq(7).text(nextAction.desc);
                                tr_holder.eq(8).find("a").text(self.$("#workflowDd option:selected").text());
                                tr_holder.eq(9).text(self.$("#salesPersonDd option:selected").text());

								
                            }
                            break;
                        case 'kanban':
                            {
                                var kanban_holder = $("#" + model._id);
                                kanban_holder.find(".opportunity-header h4").text(name);
                                kanban_holder.find(".opportunity-header h3").text("$"+expectedRevenueValue);
                                kanban_holder.find(".opportunity-content p.right").text(nextAction.date);
                                kanban_holder.find(".opportunity-content p.left").eq(0).text(self.$("#customerDd option:selected").text());
                                kanban_holder.find(".opportunity-content p.left").eq(1).text(self.$("#salesPersonDd option:selected").text());

                                if (result && result.sequence){
									$("#" + data.workflowStart).find(".item").each(function () {
										var seq = $(this).find(".inner").data("sequence");
										if (seq > data.sequenceStart) {
											$(this).find(".inner").attr("data-sequence", seq - 1);
										}
									});
                                    kanban_holder.find(".inner").attr("data-sequence", result.sequence);
								}
                                $(".column[data-id='" + data.workflow+"']").find(".columnNameDiv").after(kanban_holder);

                            }
                        }
                           self.hideDialog();
                       },
                       error: function (data,data2) {
                           self.hideDialog();
                           Backbone.history.navigate("home", { trigger: true });
                       }
                   });
               },

               hideDialog: function () {
                   $(".edit-dialog").remove();
                   $(".add-group-dialog").remove();
                   $(".add-user-dialog").remove();
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
                           success: function (model) {
							   model = model.toJSON();
							   
							   var viewType = custom.getCurrentVT();
							   switch (viewType) {
							   case 'list':
								   {
									   $("tr[data-id='" + model._id + "'] td").remove();
	
								   }
								   break;
							   case 'kanban':
								   {
									   $("#" + model._id).remove();
									   //count kanban
									   var wId = model.workflow._id;
									   var newTotal = ($("td[data-id='" + wId + "'] .totalCount").html()-1);
									   $("td[data-id='" + wId + "'] .totalCount").html(newTotal);
								   }
							   }
							   self.hideDialog();
                           },
                           error: function () {
                               $('.edit-opportunity-dialog').remove();
                               Backbone.history.navigate("home", { trigger: true });
                           }
                       });
                   }
               },
               render: function () {
                   var formString = this.template({
                       model: this.currentModel.toJSON()
                   });var self = this;
                   this.$el = $(formString).dialog({
					   closeOnEscape: false,
                       dialogClass: "edit-dialog",
                       width: 900,
                       buttons: {
                           save: {
                               text: "Save",
                               class: "btn",
                               click: self.saveItem
                           },
                           cancel: {
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
                   $('#nextActionDate').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                   $('#expectedClosing').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                   var model = this.currentModel.toJSON();

                   common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
                   common.populateUsers("#allUsers", "/UsersForDd",this.currentModel.toJSON(),null,true);
                   common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",this.currentModel.toJSON(),this.pageG);

				   populate.getPriority("#priorityDd",this);
				   populate.get2name("#customerDd", "/Customer",{},this,false,true);
				   populate.get2name("#salesPersonDd", "/getForDdByRelatedUser",{},this,false,true);
				   populate.getWorkflow("#workflowDd","#workflowNamesDd","/WorkflowsForDd",{id:"Opportunities"},"name",this);
				   populate.get("#salesTeamDd", "/DepartmentsForDd",{},"departmentName",this,false,true);


/*                   common.populateCustomers("#customerDd", "/Customer", model);
                   //common.populateEmployeesDd("#salesPerson"Dd, "/getSalesPerson", model);
                   common.populateEmployeesDd("#salesPersonDd", "/getForDdByRelatedUser", model);
                   common.populateDepartments("#salesTeamDd", "/DepartmentsForDd", model);
                   common.populatePriority("#priorityDd", "/Priority", model);
                   common.populateWorkflows('Opportunities', '#workflowDd', "#workflowNamesDd", '/Workflows', model);*/

                   if (model.groups)
                       if (model.groups.users.length>0||model.groups.group.length){
                           $(".groupsAndUser").show();
                           model.groups.group.forEach(function(item){
                               $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='"+ item._id+"'><td>"+item.departmentName+"</td><td class='text-right'></td></tr>");
                               $("#targetGroups").append("<li id='"+item._id+"'>"+item.departmentName+"</li>");
                           });
                           model.groups.users.forEach(function(item){
                               $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='"+ item._id+"'><td>"+item.login+"</td><td class='text-right'></td></tr>");
                               $("#targetUsers").append("<li id='"+item._id+"'>"+item.login+"</li>");
                           })

                       }
				   // this.delegateEvents(this.events);
                   return this;
               }

           });
           return EditView;
       });
