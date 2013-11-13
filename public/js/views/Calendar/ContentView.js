define([
    "text!templates/Calendar/CalendarTemplate.html",
    "text!templates/Calendar/AddCalendarDialogTemplate.html",
    "text!templates/Calendar/SyncDialog.html",
    "Calendar",
    "collections/Events/EventsCollection",
    "collections/Calendar/CalendarCollection",
    "common" ,
    "models/EventModel",
    "models/CalendarModel",
    "GoogleAuth",
    "dataService"
],
function (CalendarTemplate, AddCalendarDialogTemplate, SyncDialog, Calendar, EventsCollection, CalendarsCollection, common, EventModel, CalendarModel, GoogleAuth, dataService) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        template: _.template(CalendarTemplate),
        syncDilalogTpl: _.template(SyncDialog),
        createDlgTpl: _.template(AddCalendarDialogTemplate),

        initialize: function () {
            _.bindAll(this, 'syncDlgSubmitBtnClickHandler', 'displayEventsOnCalendar', 'createNewCalendar');
            this.eventsCollection = new EventsCollection({ idArray: ['52a866f518e8955b08b6e611'] });
            this.calendarsCollection = new CalendarsCollection();
            //this.eventsCollection.bind('reset', _.bind(this.curCalendarChange, this));
            this.calendarsCollection.bind('reset', _.bind(this.populateCalendarsList, this));
			this.render();
        },

        events: {
            "click #authBtn" : "syncCalendar",
            "click #addCalendarBtn" : "showCreateCalendarDlg",
            "click #syncCalendarBtn" : "syncCalendar",
            "click .calendarList li" : "chooseCalendar",
            "click .calendarList li .option" : "showCalendarOptions",
            "click .calendarList li .optionsDialog input" : "checkboxSyncClick",
            "click #sendToGoogle" : "sendToGoogle",
            'keydown': 'keydownHandler',
			"click":"hideAllDialog"
        },
		checkboxSyncClick:function(e){
			var isSync=true;
			if ($(e.target).attr("checked")){
				isSync=false;
			}


			$.ajax({
				type: "GET",
				url: "/ChangeSyncCalendar?id="+$(e.target).closest("li").attr("data-id")+"&isSync="+isSync,
				data: null,
				success: function(response){
					if(response){
					}
				},
				error:function(error, statusText){
					
				}
			});
		},
		hideAllDialog:function(e){
			if ($(e.target).parents(".optionsDialog").length==0){
			$(".showDialog").removeClass("showDialog");}
		},
		showCalendarOptions:function(e){
			$(e.target).parents("li").addClass("showDialog");
			return false;
		},
		chooseCalendar:function(e){
			if ($(e.target).parents(".optionsDialog").length==0){
				$(e.target).closest("li").toggleClass("checked");}
			this.curCalendarChange();
		},
		sendToGoogle:function(e){
			var curCalendarId = [];
			$('.calendarList').find("li.checked").each(function(){
				curCalendarId.push($(this).attr("data-id"));
			});

			$.ajax({
				type: "POST",
				url: "/SendToGoogleCalendar",
				data: {"calendarsId":curCalendarsId},
				success: function(response){
					if(response){
						$("#sendToGoogle").hide();
					}
					
					
				},
				error: function (error, statusText){


				},
				dataType: "json"
			});

			

		},
		syncCalendar:function(e){
			var self = this;
			//GoogleAuth.SendEventsToGoogle(this.eventsCollection, "slavik990@gmail.com");
            var strWindowFeatures = "resizable=yes,width=800, height=600";
            var winObject = window.open("/getGoogleToken", "Google Authorization", strWindowFeatures);
            var pollTimer = window.setInterval(function(){
                if(winObject.document.URL.indexOf("easyErp") != -1){
                    var url = winObject.document.url;
                    winObject.close();
					clearInterval(pollTimer);
					$.ajax({
						type: "GET",
						url: "/GoogleCalendars",
						data: event,
						success: function(response){
							if(response){
								var formString = self.syncDilalogTpl({calendarsCollection:response});
								this.syncDialog = $(formString).dialog({
									autoOpen:true,
									resizable:false,
									title: "Synchronize calendars",
									buttons:{
										submit: {
											text:"Continue",
											click: self.syncDlgSubmitBtnClickHandler
										},
										cancel: {
											text: "Cancel",
											click: self.closeSyncDialog
										}
									}
								});

							}
							
							
						},
						error: function (error, statusText){
							
						},
						dataType: "json"
					});

                }
            }, 100);

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

       hideDialog: function(){
           $('#addCalendarDlg').remove();
       },

       createNewCalendar: function(data){
           var calendar ={};
           var self = this;
           if (data.link){
               $.ajax({
                   type: "GET",
                   url: "/getXML?link="+data.link,
                   data: null,
                   success: function(response){
                       if(response.error){
                           throw new Error(response.error.message);
                       } else{
						   self.render();
						   self.calendarsCollection.fetch({
							   success: function(){
								   self.populateCalendarsList();
							   }
						   });
					   }

                   },
                   error: function (error){
					   if (error.responseText =="OK"){
						   self.eventsCollection.fetch({
							   success: function(){
								   self.render();
								   self.calendarsCollection.fetch({
									   success: function(){
										   self.populateCalendarsList();
									   }
								   });

							   }
						   });

						   
					   }
                   },
                   dataType: "json"
               });
           }
           else{
               this.calendarsCollection.create({
                   summary: data.calName,
                   synchronize: data.sync,
                   description: "EasyERP calendar events",
                   events: []
               },{
                   success:function(){
                       self.calendarsCollection.fetch({
                           success: function(){
                               self.populateCalendarsList();
                           }
                       });
                   }
               });}
       },
       createNewCalendarOnGoogle:function(){
           
       },
       showCreateCalendarDlg: function(){
           var self = this;
           var formString =  this.createDlgTpl();
           var dialog = $(formString).dialog({
               title: "Create Calendar",
               dialogClass: "edit-dialog",
               width: 300,
               buttons:{
                   create:{
                       text: "Create",
                       click: function(){
                           var calendarName = $('#calendarNameTxt').val();
                           var synchronize = $('#synchronize').attr('checked');
                           var link = $('#fromPublicCalendar').val();
                           if(calendarName.length === 0&&link.length === 0){
                               alert('Calendar name or link can not be empty!');
                               return;
                           }
                           self.createNewCalendar({calName : calendarName, sync:synchronize,link:link});
                           self.hideDialog();
                       }
                   },
                   cancel:{
                       text: "Cancel",
                       click:self.hideDialog
                   }
               }
           });
		   $("#addCalendarDlg").on("click",".changeType",function(){
			   $(".swicher").hide();
			   $(".swicher."+$(this).val()).show();
			   
		   })
       },
        

       curCalendarChange: function(){
           var curCalendarId = [];
			   $('.calendarList').find("li.checked").each(function(){
				   curCalendarId.push($(this).attr("data-id"));
			   });
           var currentCalendarId = curCalendarId.length > 0 ? curCalendarId[0] :$('.calendarList').find("li").eq(0).attr("data-id");
           this.setCurrentCalendarId(currentCalendarId);
		   if (curCalendarId.length==0){
			   $('.calendarList').find("li").each(function(){
				   curCalendarId.push($(this).attr("data-id"));
			   });

		   }
		   var filtered = this.eventsCollection.filterById(curCalendarId, this.displayEventsOnCalendar);
           //var filtered = this.eventsCollection;
           //this.displayEventsOnCalendar(filtered);
       },
        closeSyncDialog: function(){
            $('#syncDialog').remove();
        },

        populateCalendarsList: function(){
            if(this.calendarsCollection.length > 0){
                var newSelect = $('.calendarList');
                var newOptions = $.map(this.calendarsCollection.toJSON(), function(item){
                    return $('<li/>').attr("data-id",item._id).html('<span class="check"></span><span class="text">'+item.summary+'</span><span class="option"></span><div class="optionsDialog"><input type="checkbox" name="checkme" '+((item.isSync)?"checked='checked'":"")+'/>Is calendar sync</div>')
                });
                newSelect.empty().append(newOptions);
				$('.calendarList').find("li").eq(0).addClass("checked");
                this.curCalendarChange();
                //var currentCalendarId = $('select#calendarList').val().length > 0 ? $('select#calendarList').val()[0] : $('#calendarList option:selected').val();
                //this.setCurrentCalendarId(currentCalendarId);
                return;
            }
        },
        setCurrentCalendarId: function(id){
            App.Calendar.currentCalendarId = id;
        },
        getCurrentCalendarId: function(){
            return App.Calendar.currentCalendarId;
        },

        displayEventsOnCalendar: function(events){
            Calendar.loadCalendarEvents(events);
        },

        syncDlgSubmitBtnClickHandler:function(){
			var self =this;
//            this.parseSelectedCalendars();
  //          this.loadCalendarEvents();
            var checkboxes = $('input:checkbox[name=calendarSelect]:checked');
            if(checkboxes.length == 0){
                alert('Please select calendars to synchronize');
                return;
            }
            var calendarIdList = $.map(checkboxes,function(item){
                return $(item).attr('data-id');
            });
			$.ajax({
				type: "POST",
				url: "/GoogleCalSync",
				data: {calendar:calendarIdList},
				success: function(response){
					if(response){
						   self.eventsCollection.fetch({
							   success: function(){
								   self.render();
								   self.calendarsCollection.fetch({
									   success: function(){
										   self.populateCalendarsList();
									   }
								   });

							   }
						   });
					}
				},
				error:function(error, statusText){
					
				}
			});
			this.closeSyncDialog();

        },

        showSyncDialog: function(calendars){
            var formString = this.syncDilalogTpl({calendarsCollection:calendars});
            this.syncDialog = $(formString).dialog({
                autoOpen:true,
                resizable:false,
                title: "Synchronize calendars",
                buttons:{
                    submit: {
                        text:"Continue",
                        click: this.syncDlgSubmitBtnClickHandler
                    },
                    cancel: {
                        text: "Cancel",
                        click: this.closeSyncDialog
                    }
                }
            });
        },

        authorize: function(){
            var self = this;
            GoogleAuth.Authorize(function(){
                GoogleAuth.GetCalendarsList(function(resp){
                    var calendarList = resp;
                    if(calendarList.length > 0){
                        self.showSyncDialog(calendarList);
                        //common.deleteFromLocalStorage('token');
                        common.deleteFromLocalStorage('calendars');
                        common.saveToLocalStorage('calendars', JSON.stringify(calendarList));
                    }
                });
            });
        },

        parseSelectedCalendars: function(){
            var checkboxes = $('input:checkbox[name=calendarSelect]:checked');
            if(checkboxes.length == 0){
                alert('Please select calendars to synchronize');
                return;
            }
            var calendarIdList = $.map(checkboxes,function(item){
                return $(item).attr('data-id');
            });
            var self = this;
            var calendarsJSON = JSON.parse(common.getFromLocalStorage("calendars"));
            var array = [];
            for(var i = 0; i < calendarsJSON.length; i++){
                for(var j = 0; j < calendarIdList.length; j++){
                    if(calendarsJSON[i].id == calendarIdList[j]){
                        array.push(calendarsJSON[i]);
                    }
                }
            }
            common.saveToLocalStorage('calendars', JSON.stringify(array));
        },

        loadCalendarEvents : function(){
            var calendarsJSON = JSON.parse(common.getFromLocalStorage('calendars'));
            var calendarIdList = $.map(calendarsJSON, function(item){
                return item.id;
            });
            var counter = 0;
            var self = this;
            GoogleAuth.LoadCalendarEvents(calendarIdList, function(resp, calendarId){
                counter++;
                if(resp){
                    _.each(calendarsJSON, function(item){
                        if(item.id == calendarId){
                            item.items = resp.items;
                        }
                    });

                } else {
                    if(resp.error) console.log('Error occured: ' + resp.error);
                }
                if(counter == calendarIdList.length){
                    dataService.postData("/GoogleCalSync", {mid:39, calendars:calendarsJSON}, function(resp){
                        console.log(resp);
                    });
                    self.clearLocalStorage();
                }

            });
            this.closeSyncDialog();
        },

        clearLocalStorage: function(){
            common.deleteFromLocalStorage('calendars');
            common.deleteFromLocalStorage('token');
        },

        render: function () {
            console.log('Render Calendar');
            this.$el.html(this.template());

            Calendar.initCalendar("schedulerDiv", this.eventsCollection);
            Calendar.initMiniCalendar("miniCalendar");
            return this;
        }
    });

    return ContentView;
});
