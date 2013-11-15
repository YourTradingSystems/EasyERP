define([
    "collections/Users/UsersCollection"
],
function(UsersCollection){
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
        //scheduler.backbone(eventsCollection);
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
        scheduler.locale.labels.section_assignedTo = "Assigned To";
        scheduler.locale.labels.section_eventType = "Event type";
        scheduler.locale.labels.section_eventCategory = "Event Category";
        scheduler.locale.labels.section_summary = "Subject";
        scheduler.locale.labels.section_description = "Description";
        scheduler.locale.labels.section_status = "Status";
        scheduler.locale.labels.section_text = "Text";
        scheduler.locale.labels.section_priority = "Priority";
        scheduler.locale.labels.section_visibility = "Visibility";
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
        var b = true;
        if(!scheduler.checkEvent("onLightBox")){
            scheduler.attachEvent('onLightBox', function(id){ 
				//chooce calendar
				var curCalendarId = $('#calendarList').val();
				if (curCalendarId&&curCalendarId.length>1){
					var curCalendarText = [];
					for (var i;i<curCalendarId.length;i++){
						curCalendarText.push($('#calendarList option[value="'+curCalendarId+'"]').text())
						
					}
					$('#calendarList option:selected').each(function(){
						curCalendarText.push($(this).text());
					});
					var s = "";
					for (var i=0; i<curCalendarId.length;i++){
						s+="<option value='"+curCalendarId[i]+"'>"+curCalendarText[i]+"</option>";
					}
					App.Calendar.currentCalendarId = curCalendarId[0]
					$(".dhx_cal_light .dhx_cal_larea").prepend('<div id="chooseCalendarDiv" class="dhx_wrap_section"><div class="dhx_cal_lsection">Calendar:</div><div class="dhx_cal_ltext" style="height:30px;"><select id="chooseCurrentCalendar" style="width:100%;">'+s+'</select></div></div>');
					$(".dhx_cal_light .dhx_cal_larea").css({"height":"478px"});
					$(".dhx_cal_light").css({"height":"554px"});
				}else{
					$("#chooseCalendarDiv").remove();
					$(".dhx_cal_light .dhx_cal_larea").css({"height":"454px"});
					$(".dhx_cal_light").css({"height":"544px"});

				}
				$(".dhx_cal_light").on("change","#chooseCurrentCalendar",function(){
					App.Calendar.currentCalendarId=$("#chooseCurrentCalendar option:selected").val();
				});
				//multiselect
				$(".dhx_multi_select_assignedTo").hide();
				var s="<select id='newAssignedTo' multiple>";
				$(".dhx_multi_select_assignedTo label").each(function(){
					s+="<option>"+$(this).text()+"</option>";
				});
				s+="</select>";
				$(".dhx_multi_select_assignedTo").parent().append(s);
				$("#newAssignedTo").chosen({width: "590px;"});
				$('.chosen-results').on('click','li', function(e) {
					var n = $('.chosen-results li').index($(this));
					if ($(".dhx_multi_select_assignedTo label input").eq(n).attr("checked")=="checked"){
						$(".dhx_multi_select_assignedTo label input").eq(n).removeAttr("checked")
					}
					else{
						$(".dhx_multi_select_assignedTo label input").eq(n).attr("checked","checked")
					}
				});
				//time select
				if (b){
					$(".dhx_section_time>select").hide();
					$(".dhx_section_time>select").each(function(){
						$(this).after("<span class='newTimeSelectContainer'><span class='text'>"+$(this).find("option:selected").text()+"</span></span>");
					});
				}
 					$(".dhx_section_time>select").each(function(){
						$(this).next(".newTimeSelectContainer").find(".text").text($(this).find("option:selected").text());
					});

				$(".dhx_section_time").on("click",".newTimeSelectContainer",function(){
					$(".timeModal").remove();
					var s="<div class='timeModal'><div class='hours'>";
					for (i=0;i<24;i++){
						s+="<div>"+i+"</div>";
					}
					s+="</div><div class='minute'>";
					for (i=0;i<60;i=i+5){
						s+=(i<10)?"<div>:0"+i+"</div>":("<div>:"+i+"</div>");
					}
					s+="</div></div>";
					var tx = $(this).text();
					$(this).append(s);
					$(".timeModal .hours div").eq(parseInt(tx.split(":")[0])).addClass("active");
					$(".timeModal .minute div").eq(parseInt(tx.split(":")[1])/5).addClass("active");
					return false;
				});
				$(".dhx_section_time").on("click",".timeModal .hours div",function(){
					$(this).parent().find(".active").removeClass("active");
					$(this).addClass("active");
					return false;
				});
				$(".dhx_section_time").on("click",".timeModal .minute div",function(){
					$(this).parent().find(".active").removeClass("active");
					$(this).addClass("active");
					var h=parseInt($(".timeModal .hours div.active").text());
					var m=parseInt($(".timeModal .minute div.active").text().replace(":",""));
					h=60*h+m;

					$(this).parents(".timeModal").parents(".newTimeSelectContainer").find(".text").text($(".timeModal .hours div.active").text()+$(".timeModal .minute div.active").text()).parent().prev().find("option[value='"+h+"']").attr("selected","selected");

					if ($(".dhx_section_time .dhx_readonly").eq(0).val()==$(".dhx_section_time .dhx_readonly").eq(1).val()&&$(".newTimeSelectContainer").index($(this).parents(".timeModal").parents(".newTimeSelectContainer"))==0){
					if ($(".newTimeSelectContainer").eq(0).find(".text").text().split(":")[0]=="23"){
						$(".newTimeSelectContainer").eq(1).find(".text").text($(".newTimeSelectContainer").eq(0).find(".text").text());
					}else{
						$(".newTimeSelectContainer").eq(1).find(".text").text((parseInt($(".newTimeSelectContainer").eq(0).find(".text").text().split(":")[0])+1)+":"+$(".newTimeSelectContainer").eq(0).find(".text").text().split(":")[1]);			
					}
					}
					if ($(".newTimeSelectContainer").index($(this).parents(".timeModal").parents(".newTimeSelectContainer"))){
					var f1 = parseInt($(".newTimeSelectContainer").eq(1).find(".text").text().split(":")[0])*60+parseInt($(".newTimeSelectContainer").eq(1).find(".text").text().split(":")[1])
					var f0 = parseInt($(".newTimeSelectContainer").eq(0).find(".text").text().split(":")[0])*60+parseInt($(".newTimeSelectContainer").eq(0).find(".text").text().split(":")[1])
						if (f1<f0){
							alert("End Time<Start Time");
						}
						else
							$(".timeModal").remove();
					}
					else
						$(".timeModal").remove();
					return false;
				});
				$(document).click(function(){
					$(".timeModal").remove();
				});
				b=false;
            });
        }

    }

    var applyDefaults = function(personsOptions){
        var personsOptions =  personsOptions;
        var eventCategoryOptions = [
            {key:"meetings", label: "Meetings"},
            {key:"business", label: "Business"},
            {key:"birthdays", label: "Birthdays"},
            {key:"incomes", label: "Incomes"},
            {key:"orders", label: "Orders"},
            {key:"calls", label: "Calls"},
            {key:"ideas", label: "Ideas"},
            {key:"favourites", label: "Favourites"},
            {key:"clients", label: "Clients"},
            {key:"private", label: "Private"},
            {key:"answers", label: "Answers"},
            {key:"vacations", label: "Vacations"},
            {key:"holidays", label: "Holidays"},
            {key:"projects", label: "Projects"},
            {key:"anniversaries", label: "Anniversaries"}
        ];
        var eventTypeOptions = [
            {key:"call", label: "Call"},
            {key:"todo", label: "To Do"},
            {key:"meeting", label: "Meeting"}
        ];
        var statusOptions = [
            {key:"notStarted", label:"Not started"},
            {key:"inProgress", label:"In Progress"},
            {key:"completed", label:"Completed"}
        ];
        var priorityOptions = [
            { key: "low", label: "Low"},
            { key: "medium", label: "Medium"},
            { key: "high", label: "High"}
        ];
        var visibilityOptions = [
            { key: "public", label: "Public"},
            { key: "private", label: "Private"}
        ];

        scheduler.config.lightbox.sections = [
            {name:"eventCategory", height:30, type:"select", map_to:"eventCategory", options:eventCategoryOptions},
            {name:"eventType", height:30, type:"select", map_to:"eventType", options:eventTypeOptions},
            {name:"summary", height:30, type:"textarea", map_to:"summary", defaultValue:"New Event"},
            {name:"description", height:70, type:"textarea", map_to:"description"},
            {name:"time", height:72, type:"calendar_time", map_to:"auto" },
            {name:"assignedTo", height: 50, type:"multiselect", map_to: "assignedTo", vertical:"true", options: personsOptions},
            {name:"status", height: 30, type:"select", map_to: "status", options: statusOptions},
            {name:"priority", height: 30, type:"select", map_to: "priority", options: priorityOptions},
            {name:"visibility", height: 30, type:"select", map_to: "visibility", options: visibilityOptions}
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
        var collection = new UsersCollection();
        if(collection.length == 0){
            collection.fetch({success: function(fetchedCollection){
                var personsOptions = $.map(fetchedCollection.toJSON(), function(model, index){
                    return {
                        key: model._id,
                        label: model.login
                    }
                });
                //personsOptions.unshift({key:'nobody', label:"Nobody"});
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
