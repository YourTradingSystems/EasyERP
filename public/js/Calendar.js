define([
    "collections/Events/EventsCollection",
    "collections/Employees/EmployeesCollection",
    "models/EventModel"
],
    function(EventsCollection, EmployeesCollection, EventModel){
    var saveEventId;
    var miniCalendar;

    var initCalendar = function(calendarContainer, eventsCollection){
        if(calendarContainer){
            applyDefaults();
            scheduler.init(calendarContainer, new Date(), "month");
            //var events = new EventsCollection();
            scheduler.backbone(eventsCollection);
        }
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

    var applyDefaults = function(){
        var personsOptions = populatePersons();
        var eventTypeOptions = [
            {key:"call", label: "Call"},
            {key:"todo", label: "To Do"},
            {key:"meeting", label: "Meeting"}
        ];
        var statusOptions = [
            {key:"notStarted", label:"Not started"},
            {key:"completed", label:"Completed"}
        ];
        scheduler.locale.labels.section_assignTo = "Assign To";
        scheduler.locale.labels.section_eventType = "Event type";
        scheduler.locale.labels.section_subject = "Subject";
        scheduler.locale.labels.section_description = "Description";
        scheduler.locale.labels.section_status = "Status";
        scheduler.locale.labels.section_text = "Text";
        scheduler.config.xml_date = "%Y-%m-%d";
        scheduler.config.separate_short_events = true;
        scheduler.config.event_duration = 60;
        scheduler.config.auto_end_date = true;
        scheduler.config.drag_move = true;


        scheduler.config.lightbox.sections = [
            {name:"eventType", height:40, type:"select", map_to:"eventType", options:eventTypeOptions},
            {name:"subject", height:40, type:"textarea", map_to:"subject", defaultValue:"New Event"},
            {name:"description", height:150, type:"textarea", map_to:"description"},
            {name:"time", height:72, type:"calendar_time", map_to:"auto" },
            {name:"assignTo", height: 40, type:"select", map_to: "assignTo", options: personsOptions},
            {name:"status", height: 40, type:"select", map_to: "status", options: statusOptions}
        ];

        scheduler.attachEvent("onTemplatesReady", function(){
            scheduler.templates.event_bar_text = function(start, end, ev){
                return ev.subject || "New Event";
            };
            scheduler.templates.event_text = function(start, end, ev){
                return ev.subject || "New Event";
            };
            /*scheduler.templates.event_date = function(start, end, ev){

            }*/
        });
        if(!scheduler.checkEvent("onEventSave")){
            scheduler.attachEvent('onEventSave', function(id, data, flag){
                if(!data.subject){
                    alert('Subject field can not be empty');
                    return false;
                }
                if(data.subject.trim().length == 0){
                    alert("Subject field can not contain whitespaces");
                    scheduler.formSection('subject').setValue('');
                    return false;
                }
                return true;
            });
        }
        //if(!scheduler.checkEvent("onBeforeLightbox")){
        //    scheduler.attachEvent("onBeforeLightbox", function(){

        //    });
        //}
    };

    //used to populate array of select options "Assigned to" on the lightbox
    var populatePersons = function(){
        return [
            {key:"me", label:"Me"},
            {key:"nobody", label:"Nobody"},
            {key:"you", label:"You"}];
    };
    return {
        initCalendar:initCalendar,
        initMiniCalendar:initMiniCalendar
    }

});