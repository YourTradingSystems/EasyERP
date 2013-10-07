var Department = function (logWriter, mongoose) {

    var DepartmentSchema = mongoose.Schema({
        departmentName: { type: String, default: 'emptyDepartment' },
        parentDepartment: {
            departmentId: { type: String, default: '' },
            departmentName: { type: String, default: '' }
        },
        departmentManager: {
            uid: { type: String, default: '' },
            uname: { type: String, default: 'emptyUser' }
        }

    }, { collection: 'Department' });

    var department = mongoose.model('Department', DepartmentSchema);

    function create(data, res) {
        try {
            if (typeof (data) == 'undefined') {
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
                            saveDepartmentToDB(data);
                        }
                    }
                });
            }
            function saveDepartmentToDB(data) {
                try {
                    _department = new department();
                    if ((typeof (data.departmentName) != 'undefined') && (data.departmentName != null)) {
                        _department.departmentName = data.departmentName;
                    }
                    if ((typeof (data.parentDepartment) != 'undefined') && (data.parentDepartment != null)) {
                        if (typeof (data.parentDepartment.departmentId) != 'undefined') {
                            _department.parentDepartment.departmentId = data.parentDepartment.departmentId;
                        }
                        if (typeof (data.parentDepartment.departmentName) != 'undefined') {
                            _department.parentDepartment.departmentName = data.parentDepartment.departmentName;
                        }
                    }

                    if ((typeof (data.departmentManager) != 'undefined') && (data.departmentManager != null)) {
                        if (typeof (data.departmentManager.uid) != 'undefined') {
                            _department.departmentManager.uid = data.departmentManager.uid;
                        }
                        if (typeof (data.departmentManager.uname) != 'undefined') {
                            _department.departmentManager.uname = data.departmentManager.uname;
                        }
                    }
                    _department.save(function (err, departmentt) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Department.js saveDepartmentToDb _department.save" + err);
                            res.send(500, { error: 'Department.save BD error' });
                        } else {
                            res.send(201, { success: 'A new Department crate success' });
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
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Department.js  create " + Exception);
            res.send(500, { error: 'Department.save  error' });
        }
    };

    function getForDd(func) {
        var res = {};
        res['result'] = {};
        res['result']['status'] = '2';
        res['result']['description'] = 'An error was find';
        res['data'] = [];
        department.find({}, { _id: 1, departmentName: 1 }, function (err, Departments) {
            try {
                if (err) {
                    console.log(err);
                    logWriter.log("Department.js getDepartmentsForDd Department.find " + err);
                    res['result']['description'] = err;
                    func(res);
                } else
                    if (departments) {
                        res['result']['status'] = '0';
                        res['result']['description'] = 'returned Departments is success';
                        res['data'] = departments;
                        func(res);
                    }
            }
            catch (Exception) {
                logWriter.log("Department.js getDepartmentsForDd try Department.find " + Exception);
            }
        });
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        department.find({}, function (err, Departments) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js getDepartments Department.find " + err);
                response.send(500, { error: "Can't find Department" });
            } else {
                res['data'] = Departments;
                response.send(res);
            }
        });
    };

    function update(_id, data, res) {
        try {
            delete data._id;
            department.update({ _id: _id }, data, function (err, Departments) {
                if (err) {
                    console.log(err);
                    logWriter.log("Department.js update Department.update " + err);
                    res.send(500, { error: "Can't update Department" });
                } else {
                    res.send(200, { success: 'Department updated success' });
                }
            });
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Department.js update " + Exception);
            res.send(500, { error: 'Department updated error' });
        }
    };

    function remove(_id, res) {
        department.remove({ _id: _id }, function (err, Departments) {
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