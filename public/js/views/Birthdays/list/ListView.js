define([
    'text!templates/Birthdays/list/ListTemplate.html',
    'views/Birthdays/list/ListItemView',
    'common',
    'custom'
],
function (ListTemplate, ListItemView, common, Custom) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
			this.startTime = options.startTime;
            console.log('Init Employees View');
            this.employeesCollection = options.collection.toJSON()[0];
            this.render();
        },

        render: function () {
            console.log('Render Birthday View');
            this.$el.html(_.template(ListTemplate));
            var list = this.$el.find('#birthdaysList');
            list.find("#weekList").append(new ListItemView({ collection: this.employeesCollection.weekly }).render().el);
            list.find("#monthList").append(new ListItemView({ collection: this.employeesCollection.monthly }).render().el);
            var ids = _.map( this.employeesCollection.monthly,function(item){
				return item._id;
			});
			common.getImages(ids, "/getEmployeesImages");
			this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");

        }
    });
    return ContentView;
});
