var Department = function (logWriter, mongoose) {

    var DepartmentSchema = mongoose.Schema({
        departmentName: { type: String, default: 'emptyDepartment' },
        parentDepartment: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        departmentManager: {
            id: { type: String, default: '' },
            name: { type: String, default: 'emptyUser' }
        }
    }, { collection: 'Department' });

    var department = mongoose.model('Department', DepartmentSchema);

    function create(data, res) {
        try {
            if (!data) {
                logWriter.log('JobPosition.create Incorrect Incoming Data');
                res.send(400, { error: 'JobPosition.create Incorrect Incoming Data' });
                return;
            } else {
                department.find({ departmentName: data.departmentName }, function (error, doc) {
                    if (error) {
                        console.log(error);
                        logWriter.log("Department.js create Department.find " + description);
                        res.send(500, { error: 'Department.create find error' });
                    }
                    if (doc.length > 0) {
                        res.send(400, { error: 'An Department with the same Name already exists' });
                    }
                    else {
                        if (doc.length === 0) {
                            saveToDb(data);
                        }
                    }
                });
            }
            function saveToDb(data) {
                try {
                    _department = new department();
                    if (data.departmentName) {
                        _department.departmentName = data.departmentName;
                    }
                    if (data.parentDepartment) {
                        if (data.parentDepartment._id) {
                            _department.parentDepartment.id = data.parentDepartment._id;
                        }
                        if (data.parentDepartment.name) {
                            _department.parentDepartment.name = data.parentDepartment.name;
                        }
                    }

                    if (data.departmentManager) {
                        if (data.departmentManager._id) {
                            _department.departmentManager.id = data.departmentManager._id;
                        }
                        if (data.departmentManager.name) {
                            _department.departmentManager.name = data.departmentManager.name;
                        }
                    }
                    _department.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Department.js saveDepartmentToDb _department.save" + err);
                            res.send(500, { error: 'Department.save BD error' });
                        } else {
                            res.send(201, { success: 'A new Department create success' });
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    logWriter.log("Department.js saveDepartmentToDb " + error);
                    res.send(500, { error: 'Department.save  error' });
                }
            }
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Department.js  create " + exception);
            res.send(500, { error: 'Department.save  error' });
        }
    };

    function getForDd(func) {
        var res = {};
        res['result'] = {};
        res['result']['status'] = '2';
        res['result']['description'] = 'An error was find';
        res['data'] = [];
        department.find({}, { _id: 1, departmentName: 1 }, function (err, result) {
            try {
                if (err) {
                    console.log(err);
                    logWriter.log("Department.js getDepartmentsForDd Department.find " + err);
                    res['result']['description'] = err;
                    func(res);
                } else if (result) {
                    res['result']['status'] = '0';
                    res['result']['description'] = 'returned Departments is success';
                    res['data'] = result;
                    func(res);
                }
            } catch (Exception) {
                logWriter.log("Department.js getDepartmentsForDd try Department.find " + Exception);
            }
        });
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        department.find({}, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js getDepartments Department.find " + err);
                response.send(500, { error: "Can't find Department" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function update(_id, data, res) {
        try {
            delete data._id;
            department.update({ _id: _id }, data, function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("Department.js update Department.update " + err);
                    res.send(500, { error: "Can't update Department" });
                } else {
                    res.send(200, { success: 'Department updated success' });
                }
            });
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Department.js update " + exception);
            res.send(500, { error: 'Department updated error' });
        }
    };

    function remove(_id, res) {
        department.remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js remove department.remove " + err);
                res.send(500, { error: "Can't remove Department" });
            } else {
                res.send(200, { success: 'JobPosition removed' });
            }
        });
    };


    return {

        create: create,

        getForDd: getForDd,

        get: get,

        update: update,

        remove: remove,

        Department: Department
    };
};

module.exports = Department;