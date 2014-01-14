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
            date: { type: Date }
        }

    }, { collection: 'JobPosition' });

    mongoose.model('JobPosition', jobPositionSchema);

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
                            res.send(201, { success: 'A new JobPosition create success' });
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
        models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).findById(id, function (err, response) {
            if (err) {
                console.log(err);
                logWriter.log('JobPosition.js get job.find' + err);
                res.send(500, { error: "Can't find JobPosition" });
            } else {
                var aggregate = models.get(req.session.lastDb - 1, 'Employees', employee.employeeSchema).aggregate(
                   {
                       $match: {
                           jobPosition: objectId(id)
                       }
                   },
                   function (err, result) {
                       if (err) {
                           logWriter.log('JobPosition.js getJobPositionById aggregate ' + err);
                           res.send(500, {error:"Cant't find an JobPosition"});
                       } else {
                           response.numberOfEmployees = result.length;
                           response.totalForecastedEmployees = response.expectedRecruitment + result.length;
                           res.send(response);
                       }
                   }
               );
                res.send(response);
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
            populate('editedBy.user');
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
                //console.log(res);
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

    function getCustom(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).find({});
        query.populate('department').
			populate('createdBy.user').
            populate('editedBy.user');
        query.sort({ name: 1 });
        query.exec(function (err, jobPos) {
            if (err) {
                console.log(err);
                logWriter.log('JobPosition.js get job.find' + err);
                response.send(500, { error: "Can't find JobPosition" });
            } else {
                //res['data'] = result;
                //response.send(res);
                getTotalEmployees(jobPos, 0);
                //console.log(res);
                //response.send(res);
            }
        });
        var getTotalEmployees = function(jobPositions, count) {
            if (jobPositions && jobPositions.length > count) {
                var jobId = jobPositions[count]._id.toString();
                console.log(jobId);
                var aggregate = models.get(req.session.lastDb - 1, 'Employees', employee.employeeSchema).aggregate(
                    {
                        $match: {
                            jobPosition: objectId(jobId)
                        }
                    },
                    function(err, result) {
                        if (result) {
                            jobPositions[count].numberOfEmployees = result.length;
                            jobPositions[count].totalForecastedEmployees = jobPositions[count].expectedRecruitment + result.length;
                            count++;
                            getTotalEmployees(jobPositions, count);
                        }
                    }
                );
                //    employee.employee.find({ 'jobPosition.name': jobPositions[count].name }, function (err, _employees) {
                //        if (err) {
                //            console.log(err);
                //            res['data'] = jobPositions;
                //            response.send(res);
                //        } else {
                //            jobPositions[count].numberOfEmployees = _employees.length;
                //            jobPositions[count].totalForecastedEmployees = jobPositions[count].expectedRecruitment + _employees.length;
                //            count++;
                //            getTotalEmployees(jobPositions, count);
                //        }
                //    });
                //} else {
                //    res['data'] = jobPositions;
                //    response.send(res);
            } else {
                res['data'] = jobPositions;
                response.send(res);
            }
        }
    }; //end get
    function getJobPosition(req, data, response) {
        var res = {};
        res['data'] = [];
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
                    console.log(arrOfObjectId);
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
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
                                var query = models.get(req.session.lastDb - 1, "JobPosition", jobPositionSchema).find().where('_id').in(result);
                                if (data && data.status && data.status.length > 0)
                                    query.where('workflow').in(data.status);
                                query.select("_id createdBy editedBy name department totalForecastedEmployees numberOfEmployees expectedRecruitment workflow").
									populate('createdBy.user', 'login').
									populate('editedBy.user', 'login').
									populate('department', 'departmentName').
									skip((data.page - 1) * data.count).
									limit(data.count).
                                exec(function (error, _res) {
                                    if (!error) {
                                        res['data'] = _res;
                                        res['listLength'] = _res.length;
                                        response.send(res);
                                    } else {
                                        console.log(error);
                                    }
                                });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {
                    console.log(err);
                }
            });
    }
/*    function getJobPosition(req, data,response) {
        var res = {};
        res['data'] = [];
        var i = 0;
        var qeryEveryOne = function (arrayOfId, n, workflowsId) {

            var query = models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).find();
            if (workflowsId && workflowsId.length > 0)
                query.where('workflow').in(workflowsId);
            query.where('_id').in(arrayOfId).
                populate('department').
                populate('createdBy.user').
                populate('editedBy.user').
                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        res['data'] = res['data'].concat(_res);
                        if (i == n) getjobPositions(res['data'], 0);
                    }
                });
        };

        var qeryOwner = function (arrayOfId, n, workflowsId) {
            var query = models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).find();
            if (workflowsId && workflowsId.length > 0)
                query.where('workflow').in(workflowsId);
            query.where('_id').in(arrayOfId).
                where({ 'groups.owner': data.uId }).
                populate('department').
                populate('createdBy.user').
                populate('editedBy.user').
                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        console.log(i);
                        console.log(n);
                        res['data'] = res['data'].concat(_res);
                        console.log(res['data']);
                        if (i == n) getjobPositions(res['data'], 0);
                    } else {
                        console.log(error);
                    }
                });
        };

        var qeryByGroup = function (arrayOfId, n) {
            var query = models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).find();
            if (workflowsId && workflowsId.length > 0)
                query.where('workflow').in(workflowsId);
            query.where({ 'groups.users': data.uId }).
                populate('department').
                populate('createdBy.user').
                populate('editedBy.user').
                exec(function (error, _res1) {
                    if (!error) {
                        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).find({ users: data.uId }, { _id: 1 },
                            function (err, deps) {
                                console.log(deps);
                                if (!err) {
                                    var query = models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).find();
                                    query.where('_id').in(arrayOfId).
                                        populate('department').
                                        populate('createdBy.user').
                                        populate('editedBy.user').
                                        exec(function (error, _res) {
                                            if (!error) {
                                                i++;
                                                console.log(i);
                                                console.log(n);
                                                res['data'] = res['data'].concat(_res1);
                                                res['data'] = res['data'].concat(_res);
                                                console.log(res['data']);
                                                if (i == n) getjobPositions(res['data'], 0);;
                                            } else {
                                                console.log(error);
                                            }
                                        });
                                }
                            });
                    } else {
                        console.log(error);
                    }
                });
        };

        var workflowsId = data ? data.status : null;
        models.get(req.session.lastDb - 1, 'JobPosition', jobPositionSchema).aggregate(
            {
                $group: {
                    _id: "$whoCanRW",
                    ID: { $push: "$_id" },
                    groupId: { $push: "$groups.group" }
                }
            },
            function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        result.forEach(function(application) {
                            switch (application._id) {
                                case "everyOne":
                                {
                                    qeryEveryOne(application.ID, result.length, workflowsId);
                                }
                                    break;
                                case "owner":
                                {
                                    qeryOwner(application.ID, result.length, workflowsId);
                                }
                                    break;

                                case "group":
                                {
                                    qeryByGroup(application.ID, result.length, workflowsId);
                                }
                                    break;
                            }
                        });
                    } else {
                        response.send(res);
                    }
                } else {
                    console.log(err);
                }
            }
        );

        var getjobPositions = function (jobPositions, count) {
            var startIndex,endIndex;

            if ((data.page-1)*data.count > jobPositions.length ) {
                startIndex = jobPositions.length;
            } else {
                startIndex = (data.page-1)*data.count;
            }

            if (data.page*data.count > jobPositions.length ) {
                endIndex = jobPositions.length;
            } else {
                endIndex = data.page*data.count;
            }
            res['listLength'] = jobPositions.length;
            var jobPositionsSendArray = [];
            getTotalEmployees(jobPositions, startIndex, endIndex, jobPositionsSendArray);
        }
        var getTotalEmployees = function(jobPositions, startIndex, endIndex, jobPositionsSendArray) {
            if (jobPositions && (startIndex < endIndex)) {
                var jobId = jobPositions[startIndex]._id.toString();
                models.get(req.session.lastDb - 1, "Employees", employee.employeeSchema).aggregate(
                    {
                        $match: {
                            jobPosition: objectId(jobId)
                        }
                    },
                    function(err, result) {
                        if (result) {
                            jobPositions[startIndex].numberOfEmployees = result.length;
                            jobPositions[startIndex].totalForecastedEmployees = jobPositions[startIndex].expectedRecruitment + result.length;
                            jobPositionsSendArray.push( jobPositions[startIndex]);
                            startIndex++;
                            getTotalEmployees(jobPositions, startIndex, endIndex,jobPositionsSendArray);
                        }
                    }
                );
            } else {
                res['data'] = jobPositionsSendArray;
                response.send(res);
            }
        }
    };
*/
        function update(req, _id, data, res) {
            try {
                delete data._id;
                delete data.createdBy;
                console.log(data);
                if (data.workflow.status === 'New') {
                    data.expectedRecruitment = 0;
                } else {
                    if (data.expectedRecruitment === 0) {
                        ++data.expectedRecruitment;
                    }
                }
                console.log(data);
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

            getJobPositionById: getJobPositionById,

            getCustom: getCustom,

            create: create,

            get: get,

            getJobPosition: getJobPosition,

            update: update,

            remove: remove,

			getJobPositionForDd:getJobPositionForDd,

            jobPositionSchema: jobPositionSchema
        };
    };

    module.exports = JobPosition;
