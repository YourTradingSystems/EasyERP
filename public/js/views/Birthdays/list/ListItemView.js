define([
    "text!templates/Birthdays/list/ListItemTemplate.html",
    "common",
    "Custom"
],
    function (ListItemTemplate, common, Custom) {
        var ListItemView = Backbone.View.extend({

            initialize: function () {
                //this.render();
            },

            events: {
                "click a": "gotoForm"
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = $(e.target).closest("div").data("index") + 1;
                window.location.hash = "#home/content-Employees/form/" + itemIndex;
            },

            getAge: function (birthday) {
                var today = new Date();
                var years = today.getFullYear() - birthday.getFullYear();

                birthday.setFullYear(today.getFullYear());

                if (today < birthday) {
                    years--;
                }
                return years;
            },
            
            getDaysToBirthday: function (birthday) {
                var today = new Date();
                var days = birthday.getDate()- today.getDate();
                return days;
            },

            template: _.template(ListItemTemplate),

            render: function () {
                var index = this.model.collection.indexOf(this.model);
                this.$el.attr("data-index", index);
                var dateBirth = common.ISODateToDate(this.model.get('dateBirth')).replace(/-/g, '/');
                var age = this.getAge(new Date(dateBirth));
                var daysToBirthday = this.getDaysToBirthday(new Date(dateBirth));
                this.$el.html(this.template({ model: this.model.toJSON(), age: age, dateBirth: dateBirth, daysToBirthday: daysToBirthday }));
                    return this;
            }
        });

        return ListItemView;
    });