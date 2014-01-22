var Birthdays = function (logWriter, mongoose, employee, models, event) {

    var birthdaysSchema = mongoose.Schema({
        _id: { type: Number, default: 1 },
        date: Date,
        currentEmployees: {
            weekly: Array,
            monthly: Array
        }
    }, { collection: 'birthdays' });

    mongoose.model('birthdays', birthdaysSchema);

    var getEmployeesInDateRange = function (req, callback, response) {
        var separateWeklyAndMonthly = function (arrayOfEmployees) {
            var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var daysToAdd = (dateOnly.getDay() != 0) ? 7 - dateOnly.getDay() : 0;
            var forecast = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            forecast.setDate(now.getDate() + daysToAdd);
            var nowForecast = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            nowForecast.setDate(31);
            valueOfToday = dateOnly.valueOf();
            var currentEmployees = {};

            function getDaysToBirthday(birthday) {
                var today = new Date(),
                    days,
                    firstDayOfYear = new Date(today.getFullYear() + 1, 0, 1),
                    lastDayOfYear = new Date(today.getFullYear(), 11, 31),
                    birthdayDate = birthday.getDate();

                if (birthday.getMonth() >= today.getMonth()) {
                    birthday.setFullYear(today.getFullYear());
                    days = Math.round((birthday - today) / 1000 / 60 / 60 / 24);

                } else {
                    days = Math.round((lastDayOfYear - today) / 1000 / 60 / 60 / 24);
                    days += Math.round((birthday.setFullYear(today.getFullYear() + 1) - firstDayOfYear) / 1000 / 60 / 60 / 24);
                }
                return days;
            }

            currentEmployees.monthly = arrayOfEmployees.map(function (employee) {
                if (employee.dateBirth) {
                    employee.daysForBirth = getDaysToBirthday(employee.dateBirth);
                }
                return employee;
            });

            currentEmployees.weekly = currentEmployees.monthly.filter(function (employee) {
                if (employee.dateBirth) {
                    birthday = new Date(employee.dateBirth);
                    birthday.setFullYear(dateOnly.getFullYear());
                    birthday.setHours(0);
                    var valueOfBirthday = birthday.valueOf();
                    if (valueOfBirthday >= valueOfToday) {
                        if ((valueOfBirthday <= forecast.valueOf())) {
                            return true;
                        }
                    }
                    
                }
            });
            currentEmployees.monthly.sort(function(a, b) {
                if (a.daysForBirth > b.daysForBirth)
                    return 1
                if (a.daysForBirth < b.daysForBirth)
                    return -1
                return 0;
            });
            currentEmployees.weekly.sort(function (a, b) {
                if (a.daysForBirth > b.daysForBirth)
                    return 1
                if (a.daysForBirth < b.daysForBirth)
                    return -1
                return 0;
            });
            return currentEmployees;
        };

        var now = new Date();
        var day = now.getDate();
        var _month = now.getMonth() + 1;
        var NUMBER_OF_MONTH = 2;
        var tempMonthLength = _month + NUMBER_OF_MONTH;
        var realPart;
        var query;
        if (tempMonthLength / 12 < 1) {

            query = {
                $or: [
                        { $and: [{ month: _month }, { days: { $gte: day } }, { days: { $lte: 31 } }] },
                        { $and: [{ month: { $gt: _month } }, { month: { $lt: tempMonthLength } }] },
                        { $and: [{ month: tempMonthLength }, { days: { $lte: day } }] }
                ]
            }
        } else {
            realPart = tempMonthLength % 12;
            query = {
                $or: [
                        { $and: [{ month: _month }, { days: { $gte: day } }, { days: { $lte: 31 } }] },
                        { $and: [{ month: { $gte: 1 } }, { month: { $lt: realPart } }] },
                        { $and: [{ month: realPart }, { days: { $lt: day } }] }
                ]
            }
        }

        models.get(req.session.lastDb - 1, "Employees", employee.employeeSchema).aggregate(
            {
                $match: {
                    dateBirth: { $ne: null }
                }
            },
            {
                $project: {
                    _id: 1,
                    month: { $month: '$dateBirth' },
                    days: { $dayOfMonth: '$dateBirth' }
                }
            },
            {
                $match: query
            },
            function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    var query = models.get(req.session.lastDb - 1, "Employees", employee.employeeSchema).find();
                    query.where('_id').in(res).
                        populate('relatedUser department jobPosition manager coach').
                        populate('createdBy.user').
                        populate('editedBy.user').
                        exec(function (error, ress) {
                            if (error) {
                                console.log(error);
                                callback(req, separateWeklyAndMonthly([]), response);
                            } else {
                                callback(req, separateWeklyAndMonthly(ress), response);
                            }
                        });
                }
            });
    };



    var set = function (req, currentEmployees, response) {
        var withResponse = (arguments.length == 2) ? true : false;
        var res = {};
        var data = {};
        var now = new Date();
        data['date'] = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        data['currentEmployees'] = currentEmployees,
        models.get(req.session.lastDb - 1, "birthdays", birthdaysSchema).findByIdAndUpdate({ _id: 1 }, data, { upsert: true }, function (error, birth) {
            if (error) {
                logWriter.log('Employees.create Incorrect Incoming Data');
                console.log(error);
                if (response) response.send(400, { error: 'Employees.create Incorrect Incoming Data' });
                return;
            } else {
                res['data'] = birth.currentEmployees;
                if (response) response.send(res);
                return;
            }
        });
    };

    var get = function (req, response) {

        var res = {};
        res['data'] = [];
        check(req, function (status, emloyees) {
            switch (status) {
                case -1:
                    {
                        response.send(500, { error: 'Internal Sever Error' });
                    }
                    break;
                case 0:
                    {
                        getEmployeesInDateRange(req, set, response);
                    }
                    break;
                case 1:
                    {
                        res['data'] = emloyees;
                        response.send(res);
                    }
                    break;
            }
        });
    };

    var check = function (req, calback) {
        var now = new Date();
        var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        models.get(req.session.lastDb - 1, "birthdays", birthdaysSchema).find({}, function (err, birth) {
            if (err) {
                logWriter.log('Find Birthdays Error');
                console.log(err);
                calback(-1);
            } else {
                if (birth.length == 0) {
                    calback(0);
                } else {
                    if (birth[0].date < dateOnly) {
                        calback(0);
                    } else {
                        calback(1, birth[0].currentEmployees);
                    }
                }
            }
        });
    };

    recalculate = function (req) {
        console.log('Recalculate Birthdays Start Success at ' + new Date());
        getEmployeesInDateRange(req, set);
    };

    event.on('recalculate', recalculate);

    return {
        get: get,
        recalculate: recalculate
    };
};
module.exports = Birthdays;