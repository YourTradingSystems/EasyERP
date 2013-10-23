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

                return (years < 0) ? '' : '(Age: ' + years + ')';
            },

            getDaysToBirthday: function (birthday) {
                var today = new Date(),
                    days,
                    firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1),
                    lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0),
                    todayDate = today.getDate(),
                    birthdayDate = birthday.getDate();

                if (birthday.getMonth() > today.getMonth()) {
                    days = (lastDayOfMonth.getDate() - todayDate);
                    if (birthday.getMonth() == today.getMonth() + 1) {
                        days += (birthdayDate - firstDayOfNextMonth.getDate()) + 1;
                    }
                    else {
                        var lastDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                        days += (lastDayOfNextMonth.getDate() - firstDayOfNextMonth.getDate()) + 1;
                        var firstDayOfNextNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
                        days += (birthdayDate - firstDayOfNextNextMonth.getDate()) + 1;
                    }
                }

                else {
                    days = birthdayDate - todayDate;
                }
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