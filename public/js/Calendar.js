define([
],function(){
    var initCalendar = function(calendarContainer){
        if(calendarContainer){
            applyDefaults();
            scheduler.init(calendarContainer, new Date(), "month");
        }

    }

    var applyDefaults = function(){
        /*scheduler.config.lightbox.sections = [
            {name:"description", height:200, map_to:"text", type:"textarea", focus:true},
            {name:"time", height:72, type:"time", map_to:"auto"}
        ];*/
        //change type:"time" -> type:"calendar_time"
        scheduler.locale.labels.section_assignedTo = "Assigned To";
        scheduler.locale.labels.section_eventType = "Event type";
        //alert(scheduler.locale.labels.assignedTo);
        var options = populatePersons();
        var eventTypeOptions = [
            {key:1, label: "Call"},
            {key:2, label: "To Do"},
            {key:3, label: "Meeting"}
        ];

        scheduler.config.lightbox.sections = [
            {name:"eventType", height:40,type:"select", map_to:"eventType", options:eventTypeOptions, focus: true},
            {name:"description", height:200, map_to:"text", type:"textarea", focus: true},
            {name:"time", height:72, type:"calendar_time", map_to:"auto" },
            {name:"assignedTo", height: 40, type:"select", map_to: "assignedTo", options: options}
        ]
    };

    //used to populate array of select options "Assigned to" on the lightbox
    var populatePersons = function(){
        return [
            {key:2, label:"Me"},
            {key:1, label:"Nobody"},
            {key:3, label:"You"}];
    };
    return {
        initCalendar:initCalendar
    }

});