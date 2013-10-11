define([
    "text!templates/Calendar/CalendarTemplate.html",
    "Calendar",
    "collections/Events/EventsCollection"

],
function (CalendarTemplate, Calendar, EventsCollection) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        template: _.template(CalendarTemplate),
        initialize: function (options) {
            this.eventsCollection = new EventsCollection();
            this.eventsCollection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {

        },

        render: function () {
            this.$el.html(this.template());

            Calendar.initCalendar("schedulerDiv", this.eventsCollection);
            Calendar.initMiniCalendar("miniCalendar");
            return this;
        }
    });

    return ContentView;
});
