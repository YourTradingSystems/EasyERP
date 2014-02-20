var Department = function (logWriter, mongoose, models) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var DepartmentSchema = mongoose.Schema({
        departmentName: { type: String, default: 'emptyDepartment' },
        parentDepartment: { type: ObjectId, ref: 'Department', default: null },
        departmentManager: { type: ObjectId, ref: 'Employees', default: null },
        users: [{ type: ObjectId, ref: 'Users', default: null }],
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        },
        nestingLevel: { type: Number, default: 0 },
        sequence: { type: Number, default: 0 }

    }, { collection: 'Department' });

    mongoose.model('Department', DepartmentSchema);

    function create(req, data, res) {
        try {
            if (!data) {
                logWriter.log('JobPosition.create Incorrect Incoming Data');
                res.send(400, { error: 'JobPosition.create Incorrect Incoming Data' });
                return;
            } else {
                models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).find({ departmentName: data.departmentName }, function (error, doc) {
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
                    var _department = new models.get(req.session.lastDb - 1, 'Department', DepartmentSchema)();

                    if (data.departmentName) {
                        _department.departmentName = data.departmentName;
                    }
                    if (data.uId) {
                        _department.createdBy.user = data.uId;
                    }
                    if (data.users && data.users.length > 0) {
                        _department.users = data.users;
                    }
                    if (data.parentDepartment) {
                        _department.parentDepartment = data.parentDepartment;
                    }
                    if (data.departmentManager) {
                        _department.departmentManager = data.departmentManager;

                    }
                    if (data.nestingLevel) {
                        _department.nestingLevel = data.nestingLevel;

                    }
                    if (data.sequence) {
                        _department.sequence = data.sequence;

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

    function getDepartmentById(req, id, res) {
        var query = models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).findById(id);
        query.populate('departmentManager parentDepartment').
			populate('createdBy.user').
			populate('users').
            populate('editedBy.user');

        //query.skip((data.page - 1) * data.count).limit(data.count);
        query.exec(function (err, responce) {
            if (err) {
                console.log(err);
                logWriter.log('JobPosition.js get job.find' + err);
                res.send(500, { error: "Can't find JobPosition" });
            } else {
                res.send(responce);
            }
        });
    }


    function getForDd(req, response) {
        var res = {};
        res['data'] = [ ];
        var query = models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).find();
        query.select('_id departmentName nestingLevel parentDepartment');
        query.sort({ departmentName: 1 });
        query.exec(function (err, departments) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js getDepartments Department.find " + err);
                response.send(500, { error: "Can't find Department" });
            } else {
                res['data'] = departments;
                response.send(res);
            }
        });
    };
    function getAllChildIds(req, id, callback, trueCallback) {
        models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).find({ parentDepartment: id }).exec(function (err, result) {
            var n = 0;
            if (result.length != 0) {
                result.forEach(function (item) {
                    callback(item._id);
                    getAllChildIds(req, item._id, callback, function () {
                        n++;
                        if (n == result.length) {
                            trueCallback();
                        }
                    });
                });
            } else {
                trueCallback();
            }
        });
    }
    function getForEditDd(req, id, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).find({});
        query.select('_id departmentName nestingLevel parentDepartment');
        query.sort({ departmentName: 1 });
        query.exec(function (err, departments) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js getDepartments Department.find " + err);
                response.send(500, { error: "Can't find Department" });
            } else {
                var ids = [id];
                getAllChildIds(req, id, function (id) { ids.push(id.toString()) }, function () {
                    var result = [];
                    for (var i = 0; i < departments.length; i++) {
                        if (ids.indexOf(departments[i]._id.toString()) == -1) {
                            result.push(departments[i]);
                        }
                    }
                    res['data'] = result;
                    response.send(res);
                });
            }
        });
    };

    function get(req, response) {
        var res = {};
        res['data'] = [];

        var query = models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).find({});

        query.select('_id departmentName');
        query.sort({ departmentName: 1 });
        query.exec(function (err, departments) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js getDepartments Department.find " + err);
                response.send(500, { error: "Can't find Department" });
            } else {
                res['data'] = departments;

                response.send(res);
            }
        });
    };

    function getCustomDepartment(req, data, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).find({});
		query.populate("parentDepartment","departmentName _id");
		query.populate("departmentManager","name _id");
		query.populate("users","login _id");
        query.sort({ nestingLevel: 1, sequence:-1 });
        query.exec(function (err, departments) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js getDepartments Department.find " + err);
                response.send(500, { error: "Can't find Department" });
            } else {
                res['data'] = departments;

                response.send(res);
            }
        });
    };


    function updateNestingLevel(req, id, nestingLevel, callback) {
        models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).find({ parentDepartment: id }).exec(function (err, result) {
            var n = 0;
            if (result.length != 0) {
                result.forEach(function (item) {
                    n++;

                    models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).findByIdAndUpdate(item._id, { nestingLevel: nestingLevel + 1 }, function (err, res) {
                        updateNestingLevel(req, res._id, res.nestingLevel, function () {
                            if (result.length == n)
                                callback();
                        });
                    });
                });
            } else {
                callback();
            }
        });
    }
    function update(req, _id, data, res) {
        try {
            delete data._id;
            delete data.createdBy;
            models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).update({ _id: _id }, data, function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("Department.js update Department.update " + err);
                    res.send(500, { error: "Can't update Department" });
                } else {
                    if (data.isAllUpdate) {
                        updateNestingLevel(req, _id, data.nestingLevel, function () {
                            res.send(200, { success: 'Department updated success' });
                        });
                    }
                    else {
                        res.send(200, { success: 'Department updated success' });
                    }
                }
            });
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Department.js update " + exception);
            res.send(500, { error: 'Department updated error' });
        }
    };

    function remove(req, _id, res) {
        models.get(req.session.lastDb - 1, 'Department', DepartmentSchema).remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js remove department.remove " + err);
                res.send(500, { error: "Can't remove Department" });
            } else {
                res.send(200, { success: 'Department removed' });
            }
        });
    };


    return {

        create: create,
        getDepartmentById: getDepartmentById,
        getForDd: getForDd,
        getForEditDd: getForEditDd,
        get: get,
        getCustomDepartment: getCustomDepartment,
        update: update,
        remove: remove,
        DepartmentSchema: DepartmentSchema
    };
};

module.exports = Department;
