var JobPosition = function (logWriter, mongoose, employee, department, models) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var objectId = mongoose.Types.ObjectId;
    var newObjectId = mongoose.Types.ObjectId;
    var jobPositionSchema = mongoose.Schema({
        name: { type: String, default: '' },
        expectedRecruitment: { type: Number, default: 0 },
        interviewForm: {
            id: String,
            name: String
        },
        department: { type: ObjectId, ref: 'Department' },
        description: String,
        requirements: String,
        workflow: { type: ObjectId, ref: 'workflows', default: null },
        whoCanRW: { type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne' },
        groups: {
            owner: { type: ObjectId, ref: 'Users', default: null },
            users: [{ type: ObjectId, ref: 'Users', default: null }],
            group: [{ type: ObjectId, ref: 'Department', default: null }]
        },
        numberOfEmployees: { type: Number, default: 0 },
        totalForecastedEmployees: { type: Number, default: 0 },
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        }

    }, { collection: 'JobPosition' });

    mongoose.model('JobPosition', jobPositionSchema);

    function getTotalCount(req, response) {
        var res = {};
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }

        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {},
                                    {
                                        $or: [
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.users': newObjectId(req.session.uId) }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.group': { $in: arrOfObjectId } }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'owner' },
                                                    { 'groups.owner': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            { whoCanRW: "everyOne" }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
                                res['count'] = result.length;
                                response.send(res);
                            } else {
                                logWriter.log("JobPosition.js getTotalCount JobPositions.find " + err);
                                response.send(500, { error: "Can't find JobPositions" });
                            }
                        });
                } else {
                    console.log(err);
                }
            });
    };

    function create(req, data, res) {
        try {
            if (!data) {
                logWriter.log('JobPosition.create Incorrect Incoming Data');
                res.send(400, { error: 'JobPosition.create Incorrect Incoming Data' });
                return;
            } else {
                var query = { name: data.name };
                models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).find(query, function (error, doc) {
                    if (error) {
                        console.log(error);
                        logWriter.log('JobPosition.js. create job.find' + error);
                        res.send(500, { error: 'JobPosition.create find error' });
                    }
                    if (doc.length > 0) {
                        if (doc[0].name === data.name) {
                            res.send(400, { error: 'An jobPosition with the same Name already exists' });
                        }
                    } else if (doc.length === 0) {
                        savetoDb(data);
                    }
                });
            }
            function savetoDb(data) {
                try {
                    _job = new models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema)();
                    if (data.uId) {
                        _job.createdBy.user = data.uId;
                        //uId for edited by field on creation
                        _job.editedBy.user = data.uId;
                    }
                    if (data.name) {
                        _job.name = data.name;
                    }
                    if (data.expectedRecruitment) {
                        _job.expectedRecruitment = data.expectedRecruitment;
                    }
                    if (data.interviewForm) {
                        if (data.interviewForm._id) {
                            _job.interviewForm.id = data.interviewForm._id;
                        }
                        if (data.interviewForm.name) {
                            _job.interviewForm.name = data.interviewForm.name;
                        }
                    }
                    if (data.department) {
                        //if (data.department._id) {
                        //    console.log(data.department._id);
                        _job.department = data.department;
                        //    console.log(new ObjectId(data.department._id));
                        //}
                        //if (data.department.departmentName) {
                        //    _job.department.name = data.department.departmentName;
                        //}
                    }
                    if (data.description) {
                        _job.description = data.description;
                    }
                    if (data.requirements) {
                        _job.requirements = data.requirements;
                    }
                    if (data.workflow) {
                        _job.workflow = data.workflow;
                    }
                    if (data.groups) {
                        _job.groups = data.groups;
                    }
                    if (data.whoCanRW) {
                        _job.whoCanRW = data.whoCanRW;
                    }
                    _job.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            logWriter.log("JobPosition.js create savetoDB _job.save " + err);
                            res.send(500, { error: 'JobPosition.save BD error' });
                        } else {
                            res.send(201, { success: { massage: 'A new JobPosition create success', id: result._id } });
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    logWriter.log("JobPosition.js create savetoDB " + error);
                    res.send(500, { error: 'JobPosition.save  error' });
                }
            }
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("JobPosition.js  " + exception);
            res.send(500, { error: 'JobPosition.save  error' });
        }
    };//End create

    function getJobPositionById(req, id, res) {
        var query = models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).findById(id);
        query.populate("department", "departmentName _id");
        query.populate("workflow", "name _id").
			populate('createdBy.user').
            populate('editedBy.user').
            populate('groups.users').
            populate('groups.group').
            populate('groups.owner','_id login');

        query.exec(function (err, response) {
            if (err) {
                console.log(err);
                logWriter.log('JobPosition.js get job.find' + err);
                res.send(500, { error: "Can't find JobPosition" });
            } else {
                console.log(response);
                var aggregate = models.get(req.session.lastDb - 1, 'Employees', employee.employeeSchema).aggregate(
                   {
                       $match: {
                           jobPosition: objectId(id)
                       }
                   },
                   function (err, result) {
                       if (err) {
                           logWriter.log('JobPosition.js getJobPositionById aggregate ' + err);
                           res.send(500, { error: "Cant't find an JobPosition" });
                       } else {
                           console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                           response.numberOfEmployees = result.length;
                           response.totalForecastedEmployees = response.expectedRecruitment + result.length;
                           res.send(response);
                           console.log(response);
                       }
                   }
               );
                //res.send(response);
            }
        });
    }

    function getJobPositionForDd(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).find({});
        query.select('_id name');
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('JobPosition.js get job.find' + err);
                response.send(500, { error: "Can't find JobPosition" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function get(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).find({});
        query.populate('department').
			populate('createdBy.user').
            populate('editedBy.user').
			populate('workflow', 'name _id');
        query.sort({ name: 1 });
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('JobPosition.js get job.find' + err);
                response.send(500, { error: "Can't find JobPosition" });
            } else {
                res['data'] = result;
                response.send(res);
                //getTotalEmployees(result, 0);
                //
                //response.send(res);
            }
        });
        //var getTotalEmployees = function (jobPositions, count) {
        //    if (jobPositions && jobPositions.length > count) {
        //        employee.employee.find({ 'jobPosition.name': jobPositions[count].name }, function (err, _employees) {
        //            if (err) {
        //                console.log(err);
        //                res['data'] = jobPositions;
        //                response.send(res);
        //            } else {
        //                jobPositions[count].numberOfEmployees = _employees.length;
        //                jobPositions[count].totalForecastedEmployees = jobPositions[count].expectedRecruitment + _employees.length;
        //                count++;
        //                getTotalEmployees(jobPositions, count);
        //            }
        //        });
        //    } else {
        //        res['data'] = jobPositions;
        //        response.send(res);
        //    }
        //}
    }; //end get


    function getFilter(req, response) {
        var res = {};
        res['data'] = [];

        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }

        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    models.get(req.session.lastDb - 1, "JobPosition", jobPositionSchema).aggregate(
                        {
                            $match: {
                                $or: [
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    { whoCanRW: 'group' },
                                                    { 'groups.users': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'group' },
                                                    { 'groups.group': { $in: arrOfObjectId } }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { whoCanRW: 'owner' },
                                            { 'groups.owner': newObjectId(req.session.uId) }
                                        ]
                                    },
                                    { whoCanRW: "everyOne" }
                                ]
                            }
                        },
                        //{
                        //    $skip: (data.page - 1) * data.count
                        //},
                        //{
                        //    $limit: parseInt(data.count)
                        //},
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
                                console.log(result.length);
                                var query = models.get(req.session.lastDb - 1, "JobPosition", jobPositionSchema).find().where('_id').in(result);
                                console.log(data);
                                if (data.sort && (!data.sort.totalForecastedEmployees && !data.sort.numberOfEmployees)) {
                                    query.sort(data.sort);
                                } else {
                                    query.sort({ "editedBy.date": -1 });
                                }
                                query.select("_id createdBy editedBy name department totalForecastedEmployees numberOfEmployees expectedRecruitment workflow").
                                    populate('createdBy.user', 'login').
                                    populate('editedBy.user', 'login').
                                    populate('department', 'departmentName').
									populate('workflow', 'name _id status').
                                    skip((data.page - 1) * data.count).
                                    limit(data.count).
                                    exec(function (error, _res) {
                                        if (!error) {
                                            res['data'] = _res;
                                            if (_res.length !== 0) {
                                                _res.forEach(function (ellement, index) {
                                                    models.get(req.session.lastDb - 1, 'Employees', employee.employeeSchema).find({ jobPosition: ellement._id }).count(function (err, count) {
                                                        if (count) {
                                                            ellement.numberOfEmployees = count;
                                                            ellement.totalForecastedEmployees = ellement.numberOfEmployees + ellement.expectedRecruitment;
                                                        } else if (err) {
                                                            console.log(err);
                                                            response.send(500, { error: 'Some error occured in JobPosition' });
                                                        }
                                                        //if (index === result.length - 1) {
                                                        if (index === data.count - 1 || ((result.length < data.count) && (index === result.length - 1))) {
                                                            if (data.sort && (data.sort.totalForecastedEmployees || data.sort.numberOfEmployees)) {
                                                                for (var i in data.sort) {
                                                                    switch (i) {
                                                                        case 'totalForecastedEmployees':
                                                                            {
                                                                                res['data'].sort(function (a, b) {
                                                                                    if (+data.sort[i] === 1) {
                                                                                        if (a.totalForecastedEmployees > b.totalForecastedEmployees)
                                                                                            return 1;
                                                                                        if (a.totalForecastedEmployees < b.totalForecastedEmployees)
                                                                                            return -1;
                                                                                        return 0;
                                                                                    } else {
                                                                                        if (a.totalForecastedEmployees < b.totalForecastedEmployees)
                                                                                            return 1;
                                                                                        if (a.totalForecastedEmployees > b.totalForecastedEmployees)
                                                                                            return -1;
                                                                                        return 0;
                                                                                    }
                                                                                });
                                                                            };
                                                                            break;
                                                                        case 'numberOfEmployees':
                                                                            {
                                                                                res['data'].sort(function (a, b) {
                                                                                    if (+data.sort[i] === 1) {
                                                                                        if (a.numberOfEmployees > b.numberOfEmployees)
                                                                                            return 1;
                                                                                        if (a.numberOfEmployees < b.numberOfEmployees)
                                                                                            return -1;
                                                                                        return 0;
                                                                                    } else {
                                                                                        if (a.numberOfEmployees < b.numberOfEmployees)
                                                                                            return 1;
                                                                                        if (a.numberOfEmployees > b.numberOfEmployees)
                                                                                            return -1;
                                                                                        return 0;
                                                                                    }
                                                                                });
                                                                            };
                                                                            break;
                                                                    }
                                                                }

                                                            }
                                                            response.send(res);
                                                        }
                                                    });
                                                });
                                            } else {
                                                response.send(res);
                                            }
                                            //response.send(res);
                                        } else {
                                            console.log(error);
                                            response.send(500, { error: 'Some error occured in JobPosition' });
                                        }
                                    });
                            } else {
                                console.log(err);
                                response.send(500, { error: 'Some error occured in JobPosition' });
                            }
                        }
                    );
                } else {
                    console.log(err);
                    response.send(500, { error: 'Some error occured in JobPosition' });
                }
            });
    }

    function update(req, _id, data, res) {
        try {
            delete data._id;
            delete data.createdBy;
            console.log(data);
            if (data.workflow === '528ce71ef3f67bc40b00001d') {
                ++data.expectedRecruitment;
            } else {
                if (data.workflow && data.expectedRecruitment !== 0)
                    --data.expectedRecruitment;
            }
            data.numberOfEmployees = data.numberOfEmployees || 0;
            data.totalForecastedEmployees = data.expectedRecruitment + data.numberOfEmployees;
            if (data.department && data.department._id) {
                data.department = data.department._id;
            }
            if (data.workflow && data.workflow._id) {
                data.workflow = data.workflow._id;
            }
            models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).update({ _id: _id }, data, function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("JobPosition.js update job.update " + err);
                    res.send(500, { error: "Can't update JobPosition" });
                } else {
                    res.send(200, { success: 'JobPosition updated success' });
                }
            });
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("JobPosition.js update " + exception);
            res.send(500, { error: 'JobPosition updated error' });
        }
    };// end update

    function remove(req, _id, res) {
        models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("JobPosition.js remove job.remove " + err);
                res.send(500, { error: "Can't remove JobPosition" });
            } else {
                res.send(200, { success: 'JobPosition removed' });
            }
        });
    };// end remove

    return {
        getTotalCount: getTotalCount,

        getJobPositionById: getJobPositionById,

        //getCustom: getCustom,

        create: create,

        get: get,

        getFilter: getFilter,

        update: update,

        remove: remove,

        getJobPositionForDd: getJobPositionForDd,

        jobPositionSchema: jobPositionSchema
    };
};

module.exports = JobPosition;
