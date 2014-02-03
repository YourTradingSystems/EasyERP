var Project = function (logWriter, mongoose, department, models, workflow) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var newObjectId = mongoose.Types.ObjectId;
    var ProjectSchema = mongoose.Schema({
        projectShortDesc: { type: String, default: 'emptyProject' },
        projectName: { type: String, default: 'emptyProject' },
        task: [{ type: ObjectId, ref: 'Tasks', default: null }],
        privacy: { type: String, default: 'All Users' },
        customer: { type: ObjectId, ref: 'Customers', default: null },
        projectmanager: { type: ObjectId, ref: 'Employees', default: null },
        whoCanRW: { type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne' },
        groups: {
            owner: { type: ObjectId, ref: 'Users', default: null },
            users: [{ type: ObjectId, ref: 'Users', default: null }],
            group: [{ type: ObjectId, ref: 'Department', default: null }]
        },
        info: {
            StartDate: Date,
            EndDate: Date,
            duration: Number,
            sequence: { type: Number, default: 0 },
            parent: { type: String, default: null }
        },
        workflow: { type: ObjectId, ref: 'workflows', default: null },
        color: { type: String, default: '#4d5a75' },
        estimated: { type: Number, default: 0 },
        logged: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 },
        progress: { type: Number, default: 0 },
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        projecttype: { type: String, default: '' },
        notes: { type: Array, default: [] },
        attachments: [{
            id: { type: Number, default: '' },
            name: { type: String, default: '' },
            path: { type: String, default: '' },
            size: Number,
            uploaderName: { type: String, default: '' },
            uploadDate: { type: Date, default: Date.now }
        }],
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        }
    }, { collection: 'Project' });

    var TasksSchema = mongoose.Schema({
        summary: { type: String, default: '' },
        taskCount: { type: Number, default: 0 },
        project: { type: ObjectId, ref: 'Project', default: null },
        assignedTo: { type: ObjectId, ref: 'Employees', default: null },
        deadline: Date,
        tags: [String],
        description: String,
        extrainfo: {
            priority: { type: String, default: 'P3' },
            sequence: { type: Number, default: 0 },
            customer: { type: ObjectId, ref: 'Customers', default: null },
            StartDate: { type: Date, default: Date.now },
            EndDate: { type: Date, default: Date.now },
            duration: { type: Number, default: 0 }
        },
        workflow: { type: ObjectId, ref: 'workflows', default: null },
        type: { type: String, default: '' },
        color: { type: String, default: '#4d5a75' },
        estimated: { type: Number, default: 0 },
        logged: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 },
        progress: { type: Number, default: 0 },
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        notes: { type: Array, default: [] },
        attachments: [{
            id: { type: Number, default: '' },
            name: { type: String, default: '' },
            path: { type: String, default: '' },
            size: Number,
            uploaderName: { type: String, default: '' },
            uploadDate: { type: Date, default: Date.now }
        }],
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        }
    }, { collection: 'Tasks' });

    var PrioritySchema = mongoose.Schema({
        _id: Number,
        priority: String
    }, { collection: 'Priority' });

    var projectTypeSchema = mongoose.Schema({
        _id: String,
        name: String
    }, { collection: 'projectType' });

    mongoose.model('projectType', projectTypeSchema);

    mongoose.model('Project', ProjectSchema);

    mongoose.model('Tasks', TasksSchema);

    mongoose.model('Priority', PrioritySchema);

    //var toHoursMinutes = function (ticks) {
    //    var realHours = ((ticks / 1000) / 60) / 60;
    //    var hours = Math.floor(((ticks / 1000) / 60) / 60);
    //    var minutes = Math.ceil((realHours - hours) * 60);
    //    return hours + ':' + minutes;
    //};
    //var toDays = function (ticks) {
    //    var realDays = (((ticks / 1000) / 60) / 60) / 24;
    //    var days = realDays.toFixed(1);
    //    return days;
    //};

    var returnDuration = function (StartDate, EndDate) {
        var days = 0;
        if (StartDate && EndDate) {
            var startDate = new Date(StartDate);
            var endDate = new Date(EndDate);
            var tck = endDate - startDate;
            var realDays = (((tck / 1000) / 60) / 60) / 24;
            days = realDays.toFixed(1);
        }
        return days;
    };

    //var returnTotalTime = function (tasksArray) {
    //    var total = 0;
    //    var now = new Date();
    //    for (var i in tasksArray) {
    //        if ((tasksArray[i].workflow.status != 'Cancelled')
    //            && (tasksArray[i].extrainfo.StartDate)
    //            && (tasksArray[i].extrainfo.EndDate)) {
    //            try {
    //                total += (tasksArray[i].extrainfo.EndDate - tasksArray[i].extrainfo.StartDate);
    //            }
    //            catch (err) {
    //                logWriter.log("Project.js getProjects project.find calculate " + Exception);
    //            }
    //        }
    //    }
    //    return toHoursMinutes(total);
    //};

    var returnProgress = function (tasksArray) {
        var result = {};
        result.estimated = 0;
        result.remaining = 0;
        result.progress = 0;
        for (var i = 0; i < tasksArray.length; i++) {
            console.log(tasksArray[i].summary);
            if (tasksArray[i].length != 0 && tasksArray[i].workflow && tasksArray[i].workflow.status != 'Cancelled') {
                try {
                    result.estimated += tasksArray[i].estimated;
                    result.remaining += tasksArray[i].remaining;
                }
                catch (err) {
                    logWriter.log("Project.js getProjects project.find calculate " + Exception);
                }
            }
        }
        result.progress = (result.estimated != 0) ? Math.round((1 - (result.remaining / result.estimated)) * 100) : 0;
        return result;
    };

    var updateProjectTime = function (req, task) {
        if (!task.extrainfo.EndDate) {
            return false;
        } else {
            try {
                var id = (task.project._id) ? task.project._id : task.project;
                models.get(req.session.lastDb - 1, 'Project', ProjectSchema).findById(id)
                    //.where('info.EndDate')
                    //.lte(task.extrainfo.EndDate)
                    //.or([{ 'info.EndDate': { $lt: task.extrainfo.EndDate } },
                    //     { 'info.StartDate': { $gt: task.extrainfo.StartDate } }])
                    .exec(function (err, _project) {
                        if (_project) {
                            if (!_project.info.StartDat && !_project.info.EndDate) {
                                models.get(req.session.lastDb - 1, 'Project', ProjectSchema).update(
                                    {
                                        _id: _project._id
                                    },
                                    {
                                        $set: {
                                            'info.StartDate': task.extrainfo.StartDate,
                                            'info.EndDate': task.extrainfo.EndDate,
                                            'info.duration': returnDuration(task.extrainfo.StartDate, task.extrainfo.EndDate)
                                        }
                                    },
                                    function (err, success) {
                                        if (!err) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                            } else {
                                if (_project.info.EndDate < task.extrainfo.EndDate) {
                                    models.get(req.session.lastDb - 1, 'Project', ProjectSchema).update(
                                        {
                                            _id: _project._id
                                        },
                                        {
                                            $set: {
                                                'info.EndDate': task.extrainfo.EndDate,
                                                'info.duration': returnDuration(_project.info.StartDate, task.extrainfo.EndDate)
                                            }
                                        },
                                        function (err, success) {
                                            if (!err) {
                                                if (_project.info.StartDate > task.extrainfo.StartDate) {
                                                    models.get(req.session.lastDb - 1, 'Project', ProjectSchema).update(
                                                        {
                                                            _id: _project._id
                                                        },
                                                        {
                                                            $set: {
                                                                'info.StartDate': task.extrainfo.StartDate,
                                                                'info.duration': returnDuration(task.extrainfo.StartDate, _project.info.EndDate)
                                                            }
                                                        },
                                                        function (err, success) {
                                                            if (!err) {
                                                                return true;
                                                            } else {
                                                                return false;
                                                            }
                                                        });
                                                } else return false;
                                            } else {
                                                return false;
                                            }
                                        });
                                }
                                if (_project.info.StartDate > task.extrainfo.StartDate) {
                                    models.get(req.session.lastDb - 1, 'Project', ProjectSchema).update(
                                        {
                                            _id: _project._id
                                        },
                                        {
                                            $set: {
                                                'info.StartDate': task.extrainfo.StartDate,
                                                'info.duration': returnDuration(task.extrainfo.StartDate, _project.info.EndDate)
                                            }
                                        },
                                        function (err, success) {
                                            if (!err) {
                                                if (_project.info.EndDate < task.extrainfo.EndDate) {
                                                    models.get(req.session.lastDb - 1, 'Project', ProjectSchema).update(
                                                        {
                                                            _id: _project._id
                                                        },
                                                        {
                                                            $set: {
                                                                'info.EndDate': task.extrainfo.EndDate,
                                                                'info.duration': returnDuration(_project.info.StartDate, task.extrainfo.EndDate)
                                                            }
                                                        },
                                                        function (err, success) {
                                                            if (!err) {
                                                                return true;
                                                            } else {
                                                                return false;
                                                            }
                                                        });
                                                } else return false;
                                            } else {
                                                return false;
                                            }
                                        });
                                }
                            }
                        } else if (err) {
                            logWriter.log('Error in updateProjectEndDate project.findById ' + err);
                            return false;
                        }
                    });
            }

            catch (exc) {
                logWriter.log('Error in updateProjectEndDate ' + exc);
                return false;
            }
        }
    };

    var _updateTask = function (req, tasksArray, fieldsObject) {
        var n = tasksArray.length;
        var i = 0;
        var _update = function (i) {
            if (i < n) {
                models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).update({ _id: tasksArray[i]._id }, { $set: fieldsObject }, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(i);
                        console.log(result);
                        i++;
                        _update(i);
                    }
                });
            } else {
                return true;
            }
        };
        _update(i);
    };

    var calculateTaskEndDate = function (startDate, estimated) {
        var iWeeks, iDateDiff, iAdjust = 0;

        estimated = estimated * 1000 * 60 * 60;              // estimated in ticks

        var endDate = startDate.getTime() + estimated;
        endDate = new Date(endDate);

        if (endDate < startDate) return -1;                 // error code if dates transposed

        var iWeekday1 = startDate.getDay();                // day of week
        var iWeekday2 = endDate.getDay();

        iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1;   // change Sunday from 0 to 7
        iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;

        if ((iWeekday1 <= 5) && (iWeekday2 <= 5) && (iWeekday1 > iWeekday2)) iAdjust = 1;  // adjustment if both days on weekend

        iWeekday1 = (iWeekday1 <= 5) ? 0 : 1;    // only count weekdays
        iWeekday2 = (iWeekday2 <= 5) ? 0 : 1;
        // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
        iWeeks = Math.floor((endDate.getTime() - startDate.getTime()) / 604800000)

        if (iWeekday1 < iWeekday2) {
            iDateDiff = (iWeeks * 2) + 2 * (iWeekday2 - iWeekday1);
        } else if ((iWeekday1 == iWeekday2) && (iWeekday1 == 0)) {
            iDateDiff = (iWeeks * 2) + 2 * iAdjust;
        } else {
            iDateDiff = (iWeeks * 2) + 2 * (iWeekday1 - iWeekday2)
        }


        //iDateDiff++;
        iDateDiff = iDateDiff * 1000 * 60 * 60 * 24;
        endDate = endDate.getTime() + iDateDiff;
        endDate = new Date(endDate);

        return endDate;
    };

    function create(req, data, res) {
        try {
            console.log(data);
            if (!data.projectName || !data.projectShortDesc) {
                logWriter.log('Project.create Incorrect Incoming Data');
                res.send(400, { error: 'Project.create Incorrect Incoming Data' });
                return;
            } else {
                models.get(req.session.lastDb - 1, 'Project', ProjectSchema).find({ projectName: data.projectName }, function (error, doc) {
                    if (error) {
                        console.log(error);
                        logWriter.log("Project.js create project.find " + error);
                        res.send(500, { error: 'Project.create find error' });
                    }
                    if (doc.length > 0) {
                        res.send(400, { error: 'An project with the same name already exists' });
                    } else if (doc.length === 0) {
                        saveProjectToBd(data);
                    }
                });
            }
            function saveProjectToBd(data) {
                try {
                    _project = new models.get(req.session.lastDb - 1, 'Project', ProjectSchema)();
                    if (data.projectName) {
                        _project.projectName = data.projectName;
                    }
                    if (data.projectShortDesc) {
                        _project.projectShortDesc = data.projectShortDesc;
                    }
                    if (data.uId) {
                        _project.createdBy.user = data.uId;
                    }

                    if (data.task) {
                        _project.task = data.task;
                    }
                    if (data.color) {
                        _project.color = data.color;
                    }
                    if (data.privacy) {
                        _project.privacy = data.privacy;
                    }
                    if (data.groups) {
                        _project.groups = data.groups;
                    }
                    if (data.whoCanRW) {
                        _project.whoCanRW = data.whoCanRW;
                    }
                    if (data.info) {
                        if (data.info.StartDate) {
                            _project.info.StartDate = data.info.StartDate;
                        }
                        if (data.info.EndDate) {
                            _project.info.EndDate = data.info.EndDate;
                        }
                        if (data.info.sequenc) {
                            _project.info.sequence = data.info.sequence;
                        }
                        if (data.info.parent) {
                            _project.info.parent = data.info.parent;
                        }
                    }
                    if (data.projecttype) {
                        _project.projecttype = data.projecttype;
                    }
                    if (data.workflow) {
                        _project.workflow = data.workflow;
                    }
                    if (data.customer) {
                        _project.customer = data.customer;
                    }
                    if (data.projectmanager) {
                        _project.projectmanager = data.projectmanager;
                    }

                    if (data.notes) {
                        _project.notes = data.notes;
                    }

                    if (data.attachments) {
                        if (data.attachments.id) {
                            _project.attachments.id = data.attachments.id;
                        }
                        if (data.attachments.name) {
                            _project.attachments.name = data.attachments.name;
                        }
                        if (data.attachments.path) {
                            _project.attachments.path = data.attachments.path;
                        }
                        if (data.attachments.size) {
                            _project.attachments.size = data.attachments.size;
                        }
                        if (data.attachments.uploadDate) {
                            _project.attachments.uploadDate = data.attachments.uploadDate;
                        }
                        if (data.attachments.uploaderName) {
                            _project.attachments.uploaderName = data.attachments.uploaderName;
                        }
                    }
                    _project.save(function (err, result) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Project.js saveProjectToDb _project.save" + err);
                                res.send(500, { error: 'Project.save BD error' });
                            } else {
                                res.send(201, { success: 'A new Project crate success', result: result });
                            }
                        }
                        catch (error) {
                            logWriter.log("Project.js create savetoBd _employee.save " + error);
                        }
                    });

                }
                catch (error) {
                    console.log(error);
                    logWriter.log("Project.js create savetoDB " + error);
                    res.send(500, { error: 'Project.save  error' });
                }
            }
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Project.js  " + Exception);
            res.send(500, { error: 'Project.save  error' });
        }
    };

    function getProjectPMForDashboard(req, response) {
        models.get(req.session.lastDb - 1, "Workflows", workflow.workflowSchema).findOne({ status: "In Progress", "wId": "Projects" }).exec(function (error, res) {
            if (!error) {
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
					        models.get(req.session.lastDb - 1, "Project", ProjectSchema).aggregate(
								{
								    $match: {
								        $and: [
											{ workflow: newObjectId(res._id.toString()) },

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
								        var query = models.get(req.session.lastDb - 1, "Project", ProjectSchema).find().where('_id').in(result);
								        query.select("projectName projectmanager _id").
											populate('projectmanager', 'name _id').
											exec(function (error, _res) {
											    if (!error) {
											        res = {}
											        res['data'] = _res;
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
					        console.log(error);
					    }
					});
            }
        });

    };
    function getProjectStatusCountForDashboard(req, response) {
        models.get(req.session.lastDb - 1, "Workflows", workflow.workflowSchema).find({ "wId": "Projects" }).select("_id status").exec(function (error, resWorkflow) {
            if (!error) {
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
					        models.get(req.session.lastDb - 1, "Project", ProjectSchema).aggregate(
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
								        var result1 = result.map(function (item) {
								            return item._id
								        });
								        var query = models.get(req.session.lastDb - 1, "Project", ProjectSchema).aggregate(
											{
											    $match: {
											        "_id": {
											            $in: result1
											        }
											    }
											},
											{
											    $group: {
											        _id: "$workflow",
											        count: { $sum: 1 }

											    }
											}

										)
								        query.exec(function (error, _res) {
								            if (!error) {
								                res = {}
								                res['data'] = _res;
								                res['workflow'] = resWorkflow;
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
					        console.log(error);
					    }
					});
            }
        });

    };

    function getForDd(req, response) {
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
                    models.get(req.session.lastDb - 1, "Project", ProjectSchema).aggregate(
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
                                var query = models.get(req.session.lastDb - 1, "Project", ProjectSchema).find().where('_id').in(result);
                                query.select("projectName").

                                exec(function (error, _res) {
                                    if (!error) {
                                        res['data'] = _res;
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
    };

    function getProjectsForList(req, data, response) {
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
                    models.get(req.session.lastDb - 1, "Project", ProjectSchema).aggregate(
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
                                var query = models.get(req.session.lastDb - 1, "Project", ProjectSchema).find().where('_id').in(result);
                                if (data && data.status && data.status.length > 0)
                                    query.where('workflow').in(data.status);
                                query.select("_id createdBy editedBy workflow projectName projectShortDesc projectmanager customer estimated remaining progress info").
									populate('createdBy.user', 'login').
									populate('editedBy.user', 'login').
									populate('projectmanager', 'name').
									populate('customer', 'name').
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
    function getProjectByEndDateForDashboard(req, data, response) {
        var res = {};
        res['data'] = [];
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
        startDate.setHours(0, 0, 0, 0);

        var endDate = new Date();
        endDate.setDate(endDate.getDate() - endDate.getDay() + 28);
        endDate.setHours(24, 59, 59, 0);

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
                    models.get(req.session.lastDb - 1, "Project", ProjectSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    { 'info.EndDate': { $gte: startDate } },
                                    { 'info.EndDate': { $lte: endDate } },
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
                                var query = models.get(req.session.lastDb - 1, "Project", ProjectSchema).find().where('_id').in(result);
                                if (data && data.status && data.status.length > 0)
                                    query.where('workflow').in(data.status);
                                query.select("_id info.EndDate projectmanager projectName").
									populate('projectmanager', 'name _id').
                                exec(function (error, _res) {
                                    if (!error) {
                                        var endThisWeek = new Date();
                                        endThisWeek.setDate(endThisWeek.getDate() - endThisWeek.getDay() + 7);
                                        endThisWeek.setHours(24, 59, 59, 0);

                                        var endNextWeek = new Date();
                                        endNextWeek.setDate(endNextWeek.getDate() - endNextWeek.getDay() + 14);
                                        endNextWeek.setHours(24, 59, 59, 0);

                                        var ret = { "This": [], "Next": [], "Next2": [] };
                                        for (var i = 0, n = _res.length; i < n; i++) {
                                            var d = new Date(_res[i].info.EndDate);
                                            endDate.setDate(endDate.getDate() - endDate.getDay() + 7);
                                            if (d < endThisWeek) {
                                                ret.This.push(_res[i]);
                                            }
                                            else {
                                                if (d < endNextWeek) {
                                                    ret.Next.push(_res[i]);
                                                }
                                                else {
                                                    ret.Next2.push(_res[i]);
                                                }

                                            }

                                        }

                                        res['data'] = ret;
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

    function get(req, data, response, next) {
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
											           models.get(req.session.lastDb - 1, "Project", ProjectSchema).aggregate(
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
                                                                   var query = models.get(req.session.lastDb - 1, "Project", ProjectSchema).find().where('_id').in(result);
                                                                   if (data && data.status && data.status.length > 0)
                                                                       query.where('workflow').in(data.status);
                                                                   query.select("_id projectName task workflow projectmanager").
                                                                       populate('workflow', 'status').
                                                                       populate('projectmanager', 'name').
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

    };

    function getById(req, data, response) {
        var query = models.get(req.session.lastDb - 1, 'Project', ProjectSchema).findById(data.id, function (err, res) { });
        query.populate('projectmanager', 'name _id');
        query.populate('customer', 'name _id');
        query.populate('workflow').
            populate('createdBy.user', '_id login').
            populate('editedBy.user', '_id login').
            populate('groups.owner', '_id name').
			populate('groups.users', '_id name').
			populate('groups.group', '_id departmentName');
        query.exec(function (err, project) {
            if (err) {
                logWriter.log("Project.js getProjectById project.find " + err);
                response.send(500, { error: "Can't find Project" });
            } else {
                response.send(project);
            }
        });
    };

    function getListLength(req, data, response) {
        var res = {};
        var addObj = {};
        if (data.parrentContentId) {
            addObj['_id'] = newObjectId(data.parrentContentId);
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
                    models.get(req.session.lastDb - 1, 'Project', ProjectSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    addObj,
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
                        function (err, projectsId) {
                            console.log('============ projectsId ===================');
                            console.log(projectsId);
                            if (!err) {
                                if (data.type == 'Tasks') {
                                    models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).
                                        where('project').in(projectsId.objectID()).
                                        select("_id").
                                        exec(function (err, result) {
                                            if (!err) {
                                                res['listLength'] = result.length;
                                                response.send(res);
                                            } else {
                                                logWriter.log("Projects.js getListLength task.find" + err);
                                                response.send(500, { error: "Can't find Tasks" });
                                            }
                                        })
                                } else {
                                    res['listLength'] = projectsId.length;
                                    response.send(res);
                                }
                            } else {
                                logWriter.log("Projects.js getListLength task.find " + err);
                                response.send(500, { error: "Can't find projects" });
                            }
                        });
                } else {
                    console.log(err);
                }
            });
    };

    function getTotalCount(req, response) {
        var res = {};
        var data = {};
        var addObj = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }

        res['showMore'] = false;

        if (data && data.parrentContentId) {
            addObj['_id'] = newObjectId(data.parrentContentId);
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
                    models.get(req.session.lastDb - 1, 'Project', ProjectSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    addObj,
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
                        function (err, projectsId) {
                            if (!err) {
                                if (data && data.type == 'Tasks') {
                                    models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).
                                        where('project').in(projectsId.objectID()).
                                        exec(function (err, result) {
                                            if (!err) {
                                                if (data.currentNumber && data.currentNumber < result.length) {
                                                    res['showMore'] = true;
                                                }
                                                res['count'] = result.length;
                                                response.send(res);
                                            } else {
                                                logWriter.log("Projects.js getListLength task.find" + err);
                                                response.send(500, { error: "Can't find Tasks" });
                                            }
                                        });
                                } else {
                                    if (data.currentNumber && data.currentNumber < projectsId.length) {
                                        res['showMore'] = true;
                                    }
                                    res['count'] = projectsId.length;
                                    response.send(res);
                                }
                            } else {
                                logWriter.log("Projects.js getListLength task.find " + err);
                                response.send(500, { error: "Can't find projects" });
                            }
                        });
                } else {
                    console.log(err);
                }
            });
    };

    function getCollectionLengthByWorkflows(req, options, res) {
        data = {};
        data['showMore'] = false;
        var addObj = {};
        if (options.parrentContentId) {
            addObj['_id'] = newObjectId(options.parrentContentId);
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
                    console.log(arrOfObjectId);
                    models.get(req.session.lastDb - 1, 'Project', ProjectSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    addObj,
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
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, projectsId) {
                            if (!err) {
                                var arrayOfProjectsId = projectsId.objectID();
                                models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).aggregate(
                                    {
                                        $match: {
                                            project: { $in: arrayOfProjectsId }
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            workflow: 1,
                                            remaining: 1
                                        }
                                    },
                                    {
                                        $group: {
                                            _id: "$workflow",
                                            count: { $sum: 1 },
                                            totalRemaining: { $sum: '$remaining' }
                                        }
                                    },
                                    function (err, responseTasks) {
                                        if (!err) {
                                            responseTasks.forEach(function (object) {
                                                if (object.count > req.session.kanbanSettings.opportunities.countPerPage)
                                                    data['showMore'] = true;
                                                data['arrayOfObjects'] = responseTasks;
                                                res.send(data);
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
                } else {
                    console.log(err);
                }
            });
    }

    function update(req, _id, data, res, remove) {
        delete data._id;
        delete data.createdBy;
        delete data.task;
        if (data.groups) {
            if (data.groups.users) {
                data.groups.users = data.groups.users.map(function (currentValue) {
                    return (currentValue._id) ? currentValue._id : currentValue;
                });
            }
            if (data.groups.group) {
                data.groups.group = data.groups.group.map(function (currentValue) {
                    return (currentValue._id) ? currentValue._id : currentValue;
                });
            }
        }
        if (data.workflow && data.workflow._id) {
            data.workflow = data.workflow._id;
        }
        if (data.workflowForList || data.workflowForKanban) {
            data = {
                $set: {
                    workflow: data.workflow
                }
            }
        }
        if (data.notes && data.notes.length != 0 && !remove) {
            var obj = data.notes[data.notes.length - 1];
            obj._id = mongoose.Types.ObjectId();
            obj.date = new Date();
            obj.author = req.session.uName;
            data.notes[data.notes.length - 1] = obj;
        }
        console.log(data);
        models.get(req.session.lastDb - 1, 'Project', ProjectSchema).findByIdAndUpdate({ _id: _id }, data, function (err, projects) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js update project.update " + err);
                res.send(500, { error: "Can't update Project" });
            } else {
                models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find({ 'project.id': _id }, function (err, result) {
                    if (err) {
                        console.log(err);
                        logWriter.log("Project.js update tasks.find " + err);
                        res.send(500, { error: "Can't update Project & tasks.find" });
                    } else {
                        if (result.length > 0) {
                            _updateTask(req, result, {
                                'project.name': data.projectName,
                                'project.projectShortDesc': data.projectShortDesc
                            });
                        }
                    }
                });
                res.send(200, projects);
            }
        });
    };

    function updateOnlySelectedFields(req, _id, data, res) {
        delete data._id;
        if (data.notes && data.notes.length != 0) {
            var obj = data.notes[data.notes.length - 1];
            obj._id = mongoose.Types.ObjectId();
            obj.date = new Date();
            obj.author = req.session.uName;
            data.notes[data.notes.length - 1] = obj;
        }
        models.get(req.session.lastDb - 1, 'Project', ProjectSchema).findByIdAndUpdate({ _id: _id }, { $set: data }, function (err, projects) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js update project.update " + err);
                res.send(500, { error: "Can't update Project" });
            } else {
                res.send(200, projects);
            }
        });
    };

    function remove(req, _id, res) {
        models.get(req.session.lastDb - 1, 'Project', ProjectSchema).remove({ _id: _id }, function (err, projects) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js remove project.remove " + err);
                res.send(500, { error: "Can't remove Project" });
            } else {
                removeTasksByPorjectID(req, _id);
                res.send(200, { success: 'Remove all tasks Starting...' });
            }
        });
    };

    function removeTasksByPorjectID(req, _id) {
        models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find({ 'project': _id }, function (err, taskss) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js removeTasksByPorjectID task.find " + err);
            } else {
                for (var i in taskss) {
                    models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).remove({ _id: taskss[i]._id }, function (errr, result) {
                        if (errr) {
                            console.log(err);
                            logWriter.log("Project.js removeTasksByPorjectID tasks.remove " + err);
                        }
                    });
                }
            }
        });
    };

    function createTask(req, data, res) {
        try {
            if (!data.summary || !data.project) {
                logWriter.log('Task.create Incorrect Incoming Data');
                res.send(400, { error: 'Task.create Incorrect Incoming Data' });
                return;
            } else {
                var projectId = data.project;
                var query = models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find({ project: projectId });
                query.sort({ taskCount: -1 });
                query.exec(function (error, _tasks) {
                    if (error) {
                        console.log(error);
                        logWriter.log("Project.js createTask tasks.find doc.length === 0" + error);
                        res.send(500, { error: 'Task find error' });
                    } else {
                        var n = (_tasks[0]) ? ++_tasks[0].taskCount : 1;
                        console.log(n);
                        saveTaskToBd(data, n);
                    }
                });
            }
            function saveTaskToBd(data, n) {
                try {
                    console.log(data);
                    _task = new models.get(req.session.lastDb - 1, 'Tasks', TasksSchema)({ taskCount: n });
                    _task.summary = data.summary;
                    if (data.project) {
                        _task.project = data.project;
                    }
                    if (data.assignedTo) {
                        _task.assignedTo = data.assignedTo;
                    }
                    if (data.type) {
                        _task.type = data.type;
                    }
                    if (data.deadline) {
                        _task.deadline = new Date(data.deadline);
                    }
                    if (data.tags) {
                        _task.tags = data.tags;
                    }
                    if (data.description) {
                        _task.description = data.description;
                    }
                    if (data.extrainfo) {
                        if (data.extrainfo.priority) {
                            _task.extrainfo.priority = data.extrainfo.priority;
                        }
                        if (data.extrainfo.sequence) {
                            _task.extrainfo.sequence = data.extrainfo.sequence;
                        }
                        if (data.extrainfo.customer) {
                            _task.extrainfo.customer = data.extrainfo.customer;
                        }
                        if (data.extrainfo.StartDate) {
                            _task.extrainfo.StartDate = new Date(data.extrainfo.StartDate);
                            if (!data.estimated) _task.extrainfo.EndDate = new Date(data.extrainfo.StartDate);
                        }
                    }
                    if (data.workflow) {
                        _task.workflow = data.workflow;
                    }
                    if (data.uId) {
                        _task.createdBy.user = data.uId;
                    }
                    if (data.logged) {
                        _task.logged = data.logged;
                    }

                    if (data.attachments) {
                        if (data.attachments.id) {
                            _task.attachments.id = data.attachments.id;
                        }
                        if (data.attachments.name) {
                            _task.attachments.name = data.attachments.name;
                        }
                        if (data.attachments.path) {
                            _task.attachments.path = data.attachments.path;
                        }
                        if (data.attachments.size) {
                            _task.attachments.size = data.attachments.size;
                        }
                        if (data.attachments.uploadDate) {
                            _task.attachments.uploadDate = data.attachments.uploadDate;
                        }
                        if (data.attachments.uploaderName) {
                            _task.attachments.uploaderName = data.attachments.uploaderName;
                        }
                    }

                    if (data.notes) {
                        _task.notes = data.notes;
                    }

                    if (data.estimated) {
                        _task.remaining = data.estimated - data.logged;
                        _task.progress = Math.round((data.logged / data.estimated) * 100);
                        _task.estimated = data.estimated;

                        var StartDate = (data.extrainfo.StartDate) ? new Date(data.extrainfo.StartDate) : new Date();
                        _task.extrainfo.EndDate = calculateTaskEndDate(StartDate, data.estimated);
                        _task.extrainfo.duration = returnDuration(StartDate, _task.extrainfo.EndDate);
                    }
                    _task.save(function (err, _task) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Project.js createTask saveTaskToBd _task.save " + err);
                            res.send(500, { error: 'Task.save BD error' });
                        } else {
                            models.get(req.session.lastDb - 1, 'Project', ProjectSchema).findByIdAndUpdate(_task.project, { $push: { task: _task._id } }, function (err, doc) {
                                if (err) {
                                    console.log(err);
                                    res.send(500, { error: 'Project.save BD error' });
                                }
                            });
                            updateProjectTime(req, _task);
                            res.send(201, { success: 'An new Task crate success', task: _task });
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    logWriter.log("Project.js  createTask saveTaskToDb " + error);
                    res.send(500, { error: 'Task.save  error' });
                }
            }
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Project.js  createTask " + Exception);
            res.send(500, { error: 'Task.save  error' });
        }
    };

    function updateTask(req, _id, data, res) {
        delete data._id;
        delete data.createdBy;

        data.remaining = data.estimated - data.logged;
        data.extrainfo.duration = returnDuration(data.extrainfo.StartDate, data.extrainfo.EndDate);
        if (data.estimated != 0) {
            data.progress = Math.round((data.logged / data.estimated) * 100);
            var StartDate = (data.extrainfo.StartDate) ? new Date(data.extrainfo.StartDate) : new Date();
            data.extrainfo.EndDate = calculateTaskEndDate(StartDate, data.estimated);
            data.extrainfo.duration = returnDuration(data.extrainfo.StartDate, data.extrainfo.EndDate);
        }
        if (data.project && data.project._id) {
            data.project = data.project._id;
        }

        if (data.project) {
            var query = models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find({ project: data.project });
            query.sort({ taskCount: -1 });
            query.exec(function (error, _tasks) {
                if (error) {
                    console.log(error);
                    logWriter.log("Project.js updateTask tasks.find doc.length === 0" + error);
                    res.send(500, { error: 'Task find error' });
                } else {

                    models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).findById(_id, function (err, task) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Project.js updateTask tasks.findById " + err);
                            res.send(500, { error: 'Task find error' });
                        } else {

                            if (!_tasks[0] || (!task || (task.project != data.project))) {
                                var n = (_tasks[0]) ? ++_tasks[0].taskCount : 1;
                                data.taskCount = n;
                            }
                            if (data.project && typeof (data.project) == 'object') {
                                data.project = data.project._id;
                            }
                            if (data.assignedTo && typeof (data.assignedTo) == 'object') {
                                data.assignedTo = data.assignedTo._id;
                            }
                            if (data.extrainfo.customer && typeof (data.extrainfo.customer) == 'object') {
                                data.extrainfo.customer = data.extrainfo.customer._id;
                            }
                            if (data.workflow && typeof (data.workflow) == 'object') {
                                data.workflow = data.workflow._id;
                            }
                            if (data.workflowForList || data.workflowForKanban) {
                                data = {
                                    $set: {
                                        workflow: data.workflow
                                    }
                                }
                            }
                            if (data.notes && data.notes.length != 0 && !remove) {
                                var obj = data.notes[data.notes.length - 1];
                                obj._id = mongoose.Types.ObjectId();
                                obj.date = new Date();
                                obj.author = req.session.uName;
                                data.notes[data.notes.length - 1] = obj;
                            }

                            models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).findByIdAndUpdate({ _id: _id }, data, function (err, taskk) {
                                if (err) {
                                    console.log(err);
                                    logWriter.log("Project.js updateTask tasks.update " + err);
                                    res.send(500, { error: "Can't update Task" });
                                } else {
                                    res.send(200, taskk);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.send(500, { error: "Can't update Task" });
        }
    };

    function removeTask(req, _id, res) {
        models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).findById(_id, function (er, task) {
            if (task) {
                models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find({ 'project.id': task.project.id }, function (_er, docs) {
                    if (docs && docs.length == 0) {
                        models.get(req.session.lastDb - 1, 'Project', ProjectSchema).update({ _id: task.project.id }, {
                            $set:
                                {
                                    'info.StartDate': '',
                                    'info.EndDate': ''
                                }
                        }, function (_err, result) {
                            if (_err) {
                                logWriter.log("Project.js => removeTask => tasks.findById =>  tasks.find => project.update " + _err);
                            }
                        })
                    } else if (_er) {
                        logWriter.log("Project.js => removeTask => tasks.findById =>  tasks.find " + _er);
                    }
                });
            } else if (er) {
                logWriter.log("Project.js => removeTask => tasks.findById " + er);
            }
        });
        models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).remove({ _id: _id }, function (err, taskk) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js remove task.remove " + err);
                res.send(500, { error: "Can't remove Task" });
            } else {
                res.send(200, { success: 'Task removed' });
            }
        });
    };

    function getTasks(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find({});
        query.populate('project assignedTo extrainfo.customer workflow createdBy.user editedBy.user').
            populate('createdBy.user').
            populate('editedBy.user');

        query.sort({ summary: 1 });
        query.exec(function (err, _tasks) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js getTasks project.find " + err);
                response.send(500, { error: "Can't find Tasks" });
            } else {
                //res['data'] = taskFormatDate(_tasks, 0);
                res['data'] = _tasks;
                //console.log(res['data']);
                response.send(res);
            }
        });
    };

    function getTasksPriority(req, response) {
        var res = {};
        res['data'] = [];
        models.get(req.session.lastDb - 1, 'Priority', PrioritySchema).find({}, function (err, _priority) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js getTasksPriority priority.find " + err);
                response.send(500, { error: "Can't find Priority" });
            } else {
                res['data'] = _priority;
                response.send(res);
            }
        });
    };

    function getProjectType(req, response) {
        var res = {};
        res['data'] = [];
        models.get(req.session.lastDb - 1, 'projectType', projectTypeSchema).find({}, function (err, projectType) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js projectType projectType.find " + err);
                response.send(500, { error: "Can't find Priority" });
            } else {
                res['data'] = projectType;
                response.send(res);
            }
        });
    };

    //function getTasksByProjectId(req, data, response) {
    //    var res = {};
    //    res['data'] = [];
    //    res['options'] = [];
    //    var optionsArray = [];
    //    var showMore = false;
    //    var i = 0;

    //    var qeryEveryOne = function (arrayOfId, n) {
    //        models.get(req.session.lastDb - 1, 'Project', ProjectSchema).find().
    //            where('_id').in(arrayOfId).
    //            exec(function (error, _res) {
    //                if (!error) {
    //                    i++;
    //                    console.log(i);
    //                    console.log(n);
    //                    res['data'] = res['data'].concat(_res);
    //                    console.log(res['data']);
    //                    if (i == n) {
    //                        qeryGetTasks(res['data'],data.parrentContentId);
    //                    }
    //                }
    //            });
    //    };

    //    var qeryOwner = function (arrayOfId, n) {
    //        models.get(req.session.lastDb - 1, 'Project', ProjectSchema).find().
    //            where('_id').in(arrayOfId).
    //            where({ 'groups.owner': data.uId }).
    //            exec(function (error, _res) {
    //                if (!error) {
    //                    i++;
    //                    console.log(i);
    //                    console.log(n);
    //                    res['data'] = res['data'].concat(_res);
    //                    console.log(res['data']);
    //                    if (i == n) {
    //                        qeryGetTasks(res['data'],data.parrentContentId);
    //                    }
    //                } else {
    //                    console.log(error);
    //                }
    //            });
    //    };

    //    var qeryByGroup = function (arrayOfId, n) {
    //        models.get(req.session.lastDb - 1, 'Project', ProjectSchema).find().
    //            where({ 'groups.users': data.uId }).
    //            exec(function (error, _res1) {
    //                if (!error) {
    //                    models.get(req.session.lastDb - 1, 'Department', department.DepartmentSchema).find({ users: data.uId }, { _id: 1 },
    //                        function (err, deps) {
    //                            console.log(deps);
    //                            if (!err) {
    //                                models.get(req.session.lastDb - 1, 'Project', ProjectSchema).find().
    //                                    where('_id').in(arrayOfId).
    //                                    where('groups.group').in(deps).
    //                                    exec(function (error, _res) {
    //                                        if (!error) {
    //                                            i++;
    //                                            console.log(i);
    //                                            console.log(n);
    //                                            res['data'] = res['data'].concat(_res1);
    //                                            res['data'] = res['data'].concat(_res);
    //                                            console.log(res['data']);
    //                                            if (i == n) {
    //                                                qeryGetTasks(res['data'],data.parrentContentId);
    //                                            }
    //                                        } else {
    //                                            console.log(error);
    //                                        }
    //                                    });
    //                            }
    //                        });
    //                } else {
    //                    console.log(error);
    //                }
    //            });
    //    };

    //    models.get(req.session.lastDb - 1, 'Project', ProjectSchema).aggregate(
    //        {
    //            $group: {
    //                _id: "$whoCanRW",
    //                ID: { $push: "$_id" },
    //                groupId: { $push: "$groups.group" }
    //            }
    //        },
    //        function (err, result) {
    //            if (!err) {
    //                if (result.length != 0) {
    //                    result.forEach(function(_project) {
    //                        switch (_project._id) {
    //                            case "everyOne":
    //                            {
    //                                qeryEveryOne(_project.ID, result.length);
    //                            }
    //                                break;
    //                            case "owner":
    //                            {
    //                                qeryOwner(_project.ID, result.length);
    //                            }
    //                                break;
    //                            case "group":
    //                            {
    //                                qeryByGroup(_project.ID, result.length);
    //                            }
    //                                break;
    //                        }
    //                    });
    //                } else {
    //                    response.send(res);
    //                }
    //            } else {
    //                console.log(err);
    //            }
    //        }
    //    );

    //    var qeryGetTasks = function (projects, projectId) {
    //        var accessCheck = false;

    //        if (projects.length != 0) {
    //            for(var k = 0; k < projects.length; k++) {
    //                if ((projects[k]._id == projectId) && (projectId)) {
    //                    accessCheck = true;
    //                };
    //                projects[k] = new newObjectId(projects[k]._id.toString());
    //            }
    //        }

    //        if (accessCheck) {
    //            var queryAggregate = models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).aggregate({ $match: { project: newObjectId(projectId) } }, { $group: { _id: "$workflow", taskId: { $push: "$_id" }, remaining: { $sum: "$remaining" } } });

    //        } else {
    //            var queryAggregate = models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).aggregate({ $match: { project: {$in: projects} } },{ $group: { _id: "$workflow", taskId: { $push: "$_id" }, remaining: { $sum: "$remaining" } } });
    //        }
    //        queryAggregate.exec(
    //            function (err, responseTasks) {
    //                if (!err) {
    //                    var responseTasksArray = [];
    //                    var columnValue = data.count;
    //                    var page = data.page;
    //                    var startIndex,endIndex;

    //                    responseTasks.forEach(function (value) {
    //                        if ((data.page-1)*data.count > value.taskId.length ) {
    //                            startIndex = value.taskId.length;
    //                        } else {
    //                            startIndex = (data.page-1)*data.count;
    //                        }

    //                        if (data.page*data.count > value.taskId.length ) {
    //                            endIndex = value.taskId.length;
    //                        } else {
    //                            endIndex = data.page*data.count;
    //                        }

    //                        for (var k = startIndex; k<endIndex; k++) {
    //                            responseTasksArray.push(value.taskId[k]);
    //                            }

    //                        var myObj = {
    //                            id: value._id,
    //                            namberOfTasks: value.taskId.length,
    //                            remainingOfTasks: value.remaining
    //                        };
    //                        optionsArray.push(myObj);
    //                        if (value.taskId.length > (page * columnValue)) {
    //                            showMore = true;
    //                        }
    //                    });
    //                    models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find().
    //                        where('_id').in(responseTasksArray).
    //                        populate('project', '_id projectShortDesc projectName').
    //                        populate('assignedTo', '_id name imageSrc').
    //                        populate('extrainfo.customer').
    //                        populate('workflow').
    //                        populate('createdBy.user').
    //                        populate('editedBy.user').
    //						sort({ 'editedBy.date': -1 }).
    //                        exec(function (err, result) {
    //                            if (!err) {
    //                                res['showMore'] = showMore;
    //                                res['options'] = optionsArray;
    //                                res['data'] = result;
    //                                response.send(res);
    //                            } else {
    //                                logWriter.log("Project.js getTasksByProjectId task.find " + err);
    //                                response.send(500, { error: "Can't find Tasks" });
    //                            }
    //                        })
    //                } else {
    //                    logWriter.log("Project.js getTasksByProjectId task.find " + err);
    //                    response.send(500, { error: "Can't group Tasks" });
    //                }
    //            });

    //    }
    //};

    function getTaskById(req, data, response) {
        console.log(')))))))))))))))))))))))))))))');
        console.log(data);
        var query = models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).findById(data.id, function (err, res) { });
        query.populate('project', '_id projectShortDesc projectName').
            populate(' assignedTo', '_id name imageSrc').
            populate('createdBy.user').
            populate('createdBy.user').
            populate('editedBy.user').
            populate('groups.users').
            populate('groups.group').
            populate('workflow').
            exec(function (err, task) {
                if (err) {
                    console.log(err);
                    logWriter.log("Project.js getTasksByProjectId task.find " + err);
                    response.send(500, { error: "Can't find Tasks" });
                } else {
                    response.send(task);
                }
            });
    };

    function getTasksForKanban(req, data, response) {
        if (data.options) {
            var page = (data.options.page) ? data.options.page : null;
            var count = (data.options.count) ? data.options.count : null;
        }
        var res = {};
        var startTime = new Date();

        res['data'] = [];
        res['workflowId'] = data.workflowId;
        var addObj = {};
        if (data.parrentContentId) {
            addObj['_id'] = newObjectId(data.parrentContentId);
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
                    models.get(req.session.lastDb - 1, 'Project', ProjectSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    addObj,
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
                        function (err, projectsId) {
                            if (!err) {
                                models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).
                                  where('project').in(projectsId.objectID()).
                                  where('workflow', newObjectId(data.workflowId)).
                                  select("_id assignedTo workflow editedBy.date deadline project taskCount summary type remaining").
                                  populate('assignedTo', 'name imageSrc').
                                  populate('project', 'projectShortDesc').
                                  populate('workflow', '_id').
                                  sort({ 'editedBy.date': -1 }).
                                  limit(req.session.kanbanSettings.tasks.countPerPage).
                                  exec(function (err, result) {
                                      if (!err) {
                                          var localRemaining = 0;
                                          result.forEach(function (value, index) {
                                              localRemaining = localRemaining + value.remaining;
                                          });
                                          res['remaining'] = localRemaining;
                                          res['data'] = result;
                                          res['time'] = (new Date() - startTime);
                                          response.send(res);
                                      } else {
                                          logWriter.log("Projects.js getTasksForKanban task.find" + err);
                                          response.send(500, { error: "Can't find Tasks" });
                                      }
                                  })
                            } else {
                                logWriter.log("Projects.js getTasksForKanban task.find " + err);
                                response.send(500, { error: "Can't group Tasks" });
                            }
                        });
                } else {
                    console.log(err);
                }
            });
    };

    function getTasksForList(req, data, response) {
        var res = {};
        var startTime = new Date();

        res['data'] = [];
        var addObj = {};
        if (data.parrentContentId) {
            addObj['_id'] = newObjectId(data.parrentContentId);
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
                    models.get(req.session.lastDb - 1, 'Project', ProjectSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    addObj,
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
                        function (err, projectsId) {
                            if (!err) {
                                models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).
                                    where('project').in(projectsId.objectID()).
                                    select("summary _id project assignedTo editedBy createdBy workflow estimated logged type progress").
                                    populate('project', 'projectShortDesc projectName').
                                    populate('assignedTo', 'name').
                                    populate('editedBy.user', 'login').
                                    populate('createdBy.user', 'login').
                                    populate('workflow', 'name').
                                    skip((data.page - 1) * data.count).
                                    limit(data.count).
                                    exec(function (err, result) {
                                        if (!err) {
                                            res['data'] = result;
                                            res['time'] = (new Date() - startTime);
                                            response.send(res);
                                        } else {
                                            logWriter.log("Projects.js getTasksForList task.find" + err);
                                            response.send(500, { error: "Can't find Tasks" });
                                        }
                                    })
                            } else {
                                logWriter.log("Projects.js getTasksForList task.find " + err);
                                response.send(500, { error: "Can't find Projects" });
                            }
                        });

                } else {
                    console.log(err);
                }
            }
        );

        var qeryGetTasksList = function (projects, projectId) {
            var accessCheck = false;

            if (projects.length != 0) {
                for (var k = 0; k < projects.length; k++) {
                    if ((projects[k]._id == projectId) && (projectId)) {
                        accessCheck = true;
                    };
                    projects[k] = new newObjectId(projects[k]._id.toString());
                }
            }

            if (accessCheck) {
                var query = models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find({ project: newObjectId(projectId) });
                query.exec(function (err, result) {
                    if (!err) {
                        res['listLength'] = result.length;
                    }
                });
                query = models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find({ project: newObjectId(projectId) });

            } else {
                var query = models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find().where('project').in(projects);
                query.exec(function (err, result) {
                    if (!err) {
                        res['listLength'] = result.length;
                    }
                });
                query = models.get(req.session.lastDb - 1, 'Tasks', TasksSchema).find().where('project').in(projects);
            }
            query.select("summary _id project assignedTo editedBy createdBy workflow estimated logged type progress");

            query.populate('project', 'projectShortDesc projectName').
                populate('assignedTo', 'name').
                populate('editedBy.user', 'login').
                populate('createdBy.user', 'login').
                populate('workflow', 'name').
                skip((data.page - 1) * data.count).limit(data.count).
                sort({ 'name.first': 1 }).
                exec(function (err, returnTasks) {
                    if (err) {
                        console.log(err);
                        logWriter.log("Project.js getTasksForList task.find " + err);
                        response.send(500, { error: "Can't find Tasks" });
                    } else {
                        res['data'] = returnTasks;
                        response.send(res);
                    }
                });
        }
    };

    return {
        create: create,//End create

        getForDd: getForDd,

        get: get,

        getListLength: getListLength,

        getTotalCount: getTotalCount,

        getCollectionLengthByWorkflows: getCollectionLengthByWorkflows,

        getProjectsForList: getProjectsForList,

        getProjectPMForDashboard: getProjectPMForDashboard,

        getProjectStatusCountForDashboard: getProjectStatusCountForDashboard,

        getProjectByEndDateForDashboard: getProjectByEndDateForDashboard,

        getById: getById,

        update: update,

        updateOnlySelectedFields: updateOnlySelectedFields,

        remove: remove,

        createTask: createTask,

        updateTask: updateTask,

        removeTask: removeTask,

        getTasks: getTasks,

        getTaskById: getTaskById,

        getTasksForList: getTasksForList,

        getTasksForKanban: getTasksForKanban,

        getTasksPriority: getTasksPriority,

        getProjectType: getProjectType,

        ProjectSchema: ProjectSchema,

        TasksSchema: TasksSchema
    };
};

module.exports = Project;
