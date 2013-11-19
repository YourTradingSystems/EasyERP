define([
    "text!templates/Calendar/CalendarTemplate.html",
    "Calendar",
    "collections/Events/EventsCollection",
    "common" ,
    "models/EventModel",
    "GoogleAuth"
],
function (CalendarTemplate, Calendar, EventsCollection, common, EventModel, GoogleAuth) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        template: _.template(CalendarTemplate),
        initialize: function () {
            this.eventsCollection = new EventsCollection();
            this.eventsCollection.bind('reset', _.bind(this.render, this));
			that = this;
            //this.render();
        },

        events: {
            "click #authBtn" : "authorize"
        },
        authorize: function(){
            GoogleAuth.Authorize(this.getCalendarEvents);
        },

        getCalendarEvents: function(resp){
			console.log(resp);
			for (var i=0;i<resp.length;i++){
				var startDate = resp[i].start.dateTime;
				var endDate = resp[i].end.dateTime;
				var summary = resp[i].summary;
				data={
					start_date:startDate,
					end_date:endDate,
					description:summary,
					id:343434
				}
				var model = new EventModel();
				model.save(data, {
                    headers: {
                        mid: 26
                    },
                    wait: true,
                    success: function (model) {
						that.render();
						
                    },
                    error: function (model, xhr, options) {
                  		console.log("error");
                    }
                });
			}
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
