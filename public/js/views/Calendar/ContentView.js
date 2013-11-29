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
            this.eventsCollection = new EventsCollection();
            this.calendarsCollection = new CalendarsCollection();
            //this.eventsCollection.bind('reset', _.bind(this.curCalendarChange, this));
            this.calendarsCollection.bind('reset', _.bind(this.populateCalendarsList, this));
			this.render();
        },

        events: {
            "click #authBtn" : "syncCalendar",
            "click #addCalendarBtn" : "showCreateCalendarDlg",
            "click #syncCalendarBtn" : "syncCalendar",
            "change #calendarList" : "curCalendarChange",
            'keydown': 'keydownHandler'
        },

		syncCalendar:function(e){
			//GoogleAuth.SendEventsToGoogle(this.eventsCollection, "slavik990@gmail.com");
            var strWindowFeatures = "resizable=yes,width=800, height=600";
            var winObject = window.open("/getGoogleToken", "Google Authorization", strWindowFeatures);
            var pollTimer = window.setInterval(function(){
                if(winObject.document.URL.indexOf("easyErp") != -1){
                    var url = winObject.document.url;
                    winObject.close();
					$.ajax({
						type: "GET",
						url: "/GoogleCalendars",
						data: event,
						success: function(response){
							if(response){
								var formString = this.syncDilalogTpl({calendarsCollection:response});
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

							}
							
							
						},
						error: function (error, statusText,sdfdf){


						},
						dataType: "jsonp"
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
           var curCalendarId = $('#calendarList').val();
           if (!curCalendarId){
               $('#calendarList option').eq(0).attr("selected","selected");
               curCalendarId = $('#calendarList').val();
           }
           var currentCalendarId = curCalendarId.length > 0 ? curCalendarId[0] : $('#calendarList option:selected').val();
           this.setCurrentCalendarId(currentCalendarId);
           var filtered = this.eventsCollection.filterById(curCalendarId);
           this.displayEventsOnCalendar(filtered);
       },
        closeSyncDialog: function(){
            $('#syncDialog').remove();
        },

        populateCalendarsList: function(){
            if(this.calendarsCollection.length > 0){
                var select = $('#calendarList');
                var options = $.map(this.calendarsCollection.toJSON(), function(item){
                    return item.summary === "EasyERP" ? $('<option/>').val(item._id).text(item.summary).attr('sync', false).attr('selected', 'selected') :
                        $('<option/>').val(item._id).text(item.summary);
                });
                select.empty().append(options);
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
            this.parseSelectedCalendars();
            this.loadCalendarEvents();
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
