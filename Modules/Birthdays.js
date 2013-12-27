var Birthdays = function (logWriter, mongoose, employee, db) {
    var birthdaysSchema = mongoose.Schema({
        _id: { type: Number, default: 1 },
        date: Date,
        currentEmployees: {
            weekly: Array,
            mounthly: Array
        }
    }, { collection: 'birthdays' });
    var birtdaysModel = db.model('birthdays', birthdaysSchema);

    var getEmployeesInDateRange = function () {
        var now = new Date();
        var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var day = now.getDate();
        var _month = now.getMonth() + 1;
        console.log(now);
        console.log(_month);
        employee.employee.aggregate(
            {
                $match: {
                    dateBirth: { $ne: null }
                }
            },
            {
                $project: {
                    _id: 1,
                    month: { $month: '$dateBirth' }
                }
            },
            {
                $match: {
                    $and:[
                    { month: { $gte: _month } }, { month: { $lte: _month + 2 } }
                    ]
                }
            },
            function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            });
    };

    var set = function (arrayOfEmployees) {
        var data = {};
        var now = new Date();
        console.log(arrayOfEmployees);
        //data['date'] = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        //data['currentEmployees'] = {},
        //    data['currentEmployees']['mounthly'] = arrayOfEmployees;
        //birtdaysModel.findByIdAndUpdate({ _id: 1 }, data, { upsert: true }, function (error, birth) {
        //    if (error) {
        //        logWriter.log('Employees.create Incorrect Incoming Data');
        //        console.log(error);
        //        response.send(400, { error: 'Employees.create Incorrect Incoming Data' });
        //        return;
        //    } else {
        //        res['data'] = birth.currentEmployees;
        //        response.send(res);
        //    }
        //});
    };

    var get = function (response) {
        var res = {};
        res['data'] = [];
        check(function (status, emloyees) {
            switch (status) {
                case -1:
                    {
                        response.send(500, { error: 'Internal Sever Error' });
                    }
                    break;
                case 0:
                    {
                        arrayOfEmployees = getEmployeesInDateRange();
                        set(arrayOfEmployees);
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

    var check = function (calback) {
        var now = new Date();
        var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        birtdaysModel.find({}, function (err, birth) {
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

    return {
        get: get
    };
};
module.exports = Birthdays;