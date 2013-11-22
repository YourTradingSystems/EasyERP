define([
    "text!templates/Calendar/CalendarTemplate.html",
    "text!templates/Calendar/SyncDialog.html",
    "Calendar",
    "collections/Events/EventsCollection",
    "collections/Calendar/CalendarCollection",
    "common" ,
    "models/EventModel",
    "models/CalendarModel",
    "GoogleAuth"
],
function (CalendarTemplate, SyncDialog, Calendar, EventsCollection, CalendarsCollection, common, EventModel, CalendarModel, GoogleAuth) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        template: _.template(CalendarTemplate),
        syncDilalogTpl: _.template(SyncDialog),
        initialize: function () {
            this.eventsCollection = new EventsCollection();
            _.bindAll(this, 'loadCalendarEvents', 'displayEventsOnCalendar');
            this.eventsCollection.bind('reset', _.bind(this.displayEventsOnCalendar, this));
            this.calendarsCollection = new CalendarsCollection();
            this.calendarsCollection.bind('reset', _.bind(this.populateCalendarsList, this));
            this.self = this;
			this.render();
        },

        events: {
            "click #authBtn" : "authorize"
        },

        closeSyncDialog: function(){
            $('#syncDialog').remove();
        },

        populateCalendarsList: function(){
            var select = $('#calendarList');
            var options = $.map(this.calendarsCollection.toJSON(), function(item){
                return $('<option/>').val(item.id).text(item.summary);
            });
            select.append(options);
        },

        displayEventsOnCalendar: function(){
            console.log('displayEventsOnCalendar');
            Calendar.loadCalendarEvents(this.eventsCollection);
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
                        click: this.loadCalendarEvents
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
                        self.saveCalendarsToDB(calendarList);
                    }
                });

            });
        },

        loadCalendarEvents : function(){
            var checkboxes = $('input:checkbox[name=calendarSelect]:checked');
            var calendarIdList = $.map(checkboxes,function(item){
                return $(item).attr('data-id');
            });
            var self = this;
            GoogleAuth.LoadCalendarEvents(calendarIdList, function(resp){
                if(resp && resp.items && resp.items.length > 0){
                    self.saveEventsToDB(resp.items);
                }else {
                    if(resp.error) console.log('Error occured: ' + resp.error);
                }

            });
        },

        saveCalendarsToDB: function(calendarArray){
            _.each(calendarArray, function(item){
                var cal = new CalendarModel();
                cal.save(item,{
                    headers: { mid: 39 },
                    success: function(){ console.log('saved calendar'); }
                });
            });
        },
        saveEventsToDB: function(eventsArray){
            var self = this;
            if(eventsArray && eventsArray.length > 0){
                this.mockFunc = _.after(eventsArray.length, function(){
                    self.eventsCollection.fetch({
                        data: $.param({
                            mid: 39
                        }),
                        reset: true
                    });
                });
                _.each(eventsArray, function(item){
                    var event = new EventModel({
                        summary: item.summary,
                        id: item.id,
                        status: item.status,
                        description: '',
                        start_date: item.start.dateTime,
                        end_date: item.end.dateTime
                    });
                    event.save({},{
                        headers: { mid: 39 },
                        success: function(){
                            console.log('saved events');
                            self.mockFunc();
                        }
                    });
                });
            }
            this.closeSyncDialog();
        },

        mockFunc: function(){
            console.log('mock');
        },

        render: function () {
            console.log('Render Calendar');
            this.$el.html(this.template());
            Calendar.initCalendar("schedulerDiv");
            //Calendar.initMiniCalendar("miniCalendar");
            return this;
        }
    });

    return ContentView;
});
