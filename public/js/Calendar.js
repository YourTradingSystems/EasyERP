define([
    "collections/Employees/EmployeesCollection"
],
function(EmployeesCollection){
    var saveEventId;
    var miniCalendar;

    var initCalendar = function(calendarContainer, eventsCollection){
        applyTemplates();
        scheduler.init(calendarContainer, new Date(), "month");
        scheduler.backbone(eventsCollection);
        populatePersons();

    }

    var loadCalendarEvents = function(eventsCollection){
        console.log('--------------------Scheduler parse-----------------------');
        scheduler.clearAll();
        scheduler.parse(eventsCollection.toJSON(), "json");
    }

    var initMiniCalendar = function(miniCalendarDiv){
        miniCalendar = scheduler.renderCalendar({
            container: miniCalendarDiv,
            navigation:true,
            handler:function(date){
                scheduler.setCurrentView(date, scheduler._mode);
            }
        })
    }

    var applyTemplates = function(){
        scheduler.locale.labels.section_assignTo = "Assign To";
        scheduler.locale.labels.section_eventType = "Event type";
        scheduler.locale.labels.section_summary = "Subject";
        scheduler.locale.labels.section_description = "Description";
        scheduler.locale.labels.section_status = "Status";
        scheduler.locale.labels.section_text = "Text";
        scheduler.locale.labels.section_priority = "Priority";
        scheduler.config.xml_date = "%Y/%m/%d";
        scheduler.config.separate_short_events = true;
        scheduler.config.event_duration = 60;
        scheduler.config.auto_end_date = true;
        scheduler.config.drag_move = true;
        scheduler.config.details_on_create = true;
        //scheduler.config.server_utc = true;
        scheduler.config.cascade_event_display = true;
        scheduler.config.cascade_event_count = 4;
        scheduler.config.cascade_event_margin = 30;
        scheduler.config.first_hour = 8;
        scheduler.config.last_hour = 21;
        scheduler.config.start_on_monday = true;
        scheduler.attachEvent("onTemplatesReady", function(){

        scheduler.templates.event_bar_text = function(start, end, ev){
            return ev.summary || "New Event";
        };
        scheduler.templates.event_text = function(start, end, ev){
            return ev.summary || "New Event";
        };
        scheduler.templates.tooltip_text = function(start,end, event){
            return "<b>Event: </b>" + event.summary + "<br/><b>Start: </b>" + dateFormat(start, "dd-mm-yyyy hh:mm") + "<br/><b>End: </b>" + dateFormat(end, "dd-mm-yyyy hh:mm");
        }
        /*scheduler.tempalte.event_class = function(start, end, event){
         if(start < (new Date()))
         return "past_event";
         }*/
        /*scheduler.templates.event_date = function(start, end, ev){

         }*/
        });

        if(!scheduler.checkEvent("onEventSave")){
            scheduler.attachEvent('onEventSave', function(id, data, flag){
                if(!data.summary){
                    alert('Subject field can not be empty');
                    return false;
                }
                if(data.summary.trim().length == 0){
                    alert("Subject field can not contain whitespaces");
                    scheduler.formSection('summary').setValue('');
                    return false;
                }
                attachEventColor(id,data);
                attachCalendarId(id);
                data.text = data.summary;
                return true;
            });
        }
    }

    var applyDefaults = function(personsOptions){
        var personsOptions =  personsOptions;
        var eventTypeOptions = [
            {key:"call", label: "Call"},
            {key:"todo", label: "To Do"},
            {key:"meeting", label: "Meeting"}
        ];
        var statusOptions = [
            {key:"notStarted", label:"Not started"},
            {key:"completed", label:"Completed"}
        ];
        var priorityOptions = [
            { key: "low", label: "Low"},
            { key: "medium", label: "Medium"},
            { key: "high", label: "High"}
        ];

        scheduler.config.lightbox.sections = [
            {name:"eventType", height:30, type:"select", map_to:"eventType", options:eventTypeOptions},
            {name:"summary", height:30, type:"textarea", map_to:"summary", defaultValue:"New Event"},
            {name:"description", height:70, type:"textarea", map_to:"description"},
            {name:"time", height:72, type:"calendar_time", map_to:"auto" },
            {name:"assignTo", height: 30, type:"select", map_to: "assignTo", options: personsOptions},
            {name:"status", height: 30, type:"select", map_to: "status", options: statusOptions},
            {name:"priority", height: 30, type:"select", map_to: "priority", options: priorityOptions}
        ];
    };
    var attachCalendarId = function(id){
        var event = scheduler.getEvent(id);
        event.calendarId = App.Calendar.currentCalendarId;
        scheduler.updateEvent(id);
    }
    var attachEventColor = function(id, data){
        var event = scheduler.getEvent(id);
        if(event){
            switch (data.eventType){
                case "call":
                    event.color = "green";
                    event.textColor = "white";
                    break;
                case "meeting":
                    event.color = "yellow";
                    event.textColor = "black";
                    break;
                case "todo":
                    event.color = "blue";
                    event.textColor = "white";
                    break;
            }
            scheduler.updateEvent(id);
        }
    }

    var populatePersons = function(){
        var collection = new EmployeesCollection();
        if(collection.length == 0){
            collection.fetch({success: function(fetchedCollection){
                var personsOptions = $.map(fetchedCollection.toJSON(), function(model, index){
                    return {
                        key: model._id,
                        label: model.name.first + " " + model.name.last
                    }
                });
                personsOptions.unshift({key:'nobody', label:"Nobody"});
                applyDefaults(personsOptions);

            }});
        }
    }


    return {
        initCalendar:initCalendar,
        initMiniCalendar:initMiniCalendar,
        loadCalendarEvents: loadCalendarEvents
    }

});
