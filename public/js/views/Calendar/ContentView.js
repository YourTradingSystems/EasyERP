define([
    "text!templates/Calendar/CalendarTemplate.html",
    "Calendar"

],
function (CalendarTemplate, Calendar) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        template: _.template(CalendarTemplate),
        initialize: function (options) {
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
            Calendar.initCalendar("schedulerDiv");
            return this;
        }
    });

    return ContentView;
});
