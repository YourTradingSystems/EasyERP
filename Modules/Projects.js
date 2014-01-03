var Project = function (logWriter, mongoose, department) {
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
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        }
    }, { collection: 'Tasks' });

    var PrioritySchema = mongoose.Schema({
        _id: Number,
        priority: String
    }, { collection: 'Priority' });

    var project = mongoose.model('Project', ProjectSchema);

    var tasks = mongoose.model('Tasks', TasksSchema);

    var priority = mongoose.model('Priority', PrioritySchema);

    var toHoursMinutes = function (ticks) {
        var realHours = ((ticks / 1000) / 60) / 60;
        var hours = Math.floor(((ticks / 1000) / 60) / 60);
        var minutes = Math.ceil((realHours - hours) * 60);
        return hours + ':' + minutes;
    };
    var toDays = function (ticks) {
        var realDays = (((ticks / 1000) / 60) / 60) / 24;
        var days = realDays.toFixed(1);
        return days;
    };

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

    var returnTotalTime = function (tasksArray) {
        var total = 0;
        var now = new Date();
        for (var i in tasksArray) {
            if ((tasksArray[i].workflow.status != 'Cancelled')
                && (tasksArray[i].extrainfo.StartDate)
                && (tasksArray[i].extrainfo.EndDate)) {
                try {
                    total += (tasksArray[i].extrainfo.EndDate - tasksArray[i].extrainfo.StartDate);
                }
                catch (err) {
                    logWriter.log("Project.js getProjects project.find calculate " + Exception);
                }
            }
        }
        return toHoursMinutes(total);
    };

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

    var updateProjectTime = function (task) {
        if (!task.extrainfo.EndDate) {
            return false;
        } else {
            try {
                var id = (task.project._id) ? task.project._id : task.project;
                project.findById(id)
                    //.where('info.EndDate')
                    //.lte(task.extrainfo.EndDate)
                    //.or([{ 'info.EndDate': { $lt: task.extrainfo.EndDate } },
                    //     { 'info.StartDate': { $gt: task.extrainfo.StartDate } }])
                    .exec(function (err, _project) {
                        if (_project) {
                            if (!_project.info.StartDat && !_project.info.EndDate) {
                                project.update(
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
                                    project.update(
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
                                                    project.update(
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
                                    project.update(
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
                                                    project.update(
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

    var _updateTask = function (tasksArray, fieldsObject) {
        var n = tasksArray.length;
        var i = 0;
        var _update = function (i) {
            if (i < n) {
                tasks.update({ _id: tasksArray[i]._id }, { $set: fieldsObject }, function (err, result) {
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

    function create(data, res) {
        try {
            console.log(data);
            if (!data.projectName || !data.projectShortDesc) {
                logWriter.log('Project.create Incorrect Incoming Data');
                res.send(400, { error: 'Project.create Incorrect Incoming Data' });
                return;
            } else {
                project.find({ projectName: data.projectName }, function (error, doc) {
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
                    _project = new project();
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
                    if (data.workflow) {
                        _project.workflow = data.workflow;
                    }
                    if (data.customer) {
                        _project.customer = data.customer;
                    }
                    if (data.projectmanager) {
                        _project.projectmanager = data.projectmanager;
                    }
                    _project.save(function (err, projectt) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Project.js saveProjectToDb _project.save" + err);
                            res.send(500, { error: 'Project.save BD error' });
                        } else {
                            res.send(201, { success: 'A new Project crate success' });
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

    function getForDd(response) {
        var res = {};
        res['data'] = [];
        var query = project.find({}, { projectName: 1, _id: 1 });
        query.sort({ projectName: 1 });
        query.exec(function (err, projects) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js getProjectsForDd project.find " + err);
                response.send(500, { error: "Can't find Project" });
            } else {
                res['data'] = projects;
                response.send(res);
                console.log(res);
            }
        });
    };

    function get(data, response) {
        var res = {};
        res['data'] = [];
        var i = 0;
        var qeryEveryOne = function (arrayOfId, n, workflowsId) {
            var query = project.find();
     		if (workflowsId&&workflowsId.length>0)
				query.where('workflow').in(workflowsId);

            query.where('_id').in(arrayOfId).
                populate("projectmanager customer task").
                populate('workflow').
                populate('createdBy.user').
                populate('editedBy.user').
				populate('groups.users').
				populate('groups.group').

            exec(function (error, _res) {
                if (!error) {
                    i++;
                    res['data'] = res['data'].concat(_res);
                    if (i == n) findTasksById(res['data'], 0);;
                }
            });
        };

        var qeryOwner = function (arrayOfId, n, workflowsId) {
            var query = project.find();
 			if (workflowsId&&workflowsId.length>0)
				query.where('workflow').in(workflowsId);
			
            query.where('_id').in(arrayOfId).
                where({ 'groups.owner': data.uId }).
                populate("projectmanager customer task").
                populate('workflow').
                populate('createdBy.user').
                populate('editedBy.user').
				populate('groups.users').
				populate('groups.group').

            exec(function (error, _res) {
                if (!error) {
                    i++;
                    console.log(i);
                    console.log(n);
                    res['data'] = res['data'].concat(_res);
                    console.log(res['data']);
                    if (i == n) findTasksById(res['data'], 0);;
                } else {
                    console.log(error);
                }
            });
        };

        var qeryByGroup = function (arrayOfId, n) {
            var query = project.find();
     		if (workflowsId&&workflowsId.length>0)
				query.where('workflow').in(workflowsId);

            query.where({ 'groups.users': data.uId }).
                populate("projectmanager customer task").
                populate('workflow').
                populate('createdBy.user').
                populate('editedBy.user').
    			populate('groups.users').
			    populate('groups.group').

            exec(function (error, _res1) {
                if (!error) {
                    department.department.find({ users: data.uId }, { _id: 1 },
											   function (err, deps) {
												   console.log(deps);
												   if (!err) {
													   project.find().
														   where('_id').in(arrayOfId).
														   where('groups.group').in(deps).
														   populate("projectmanager customer task").
														   populate('workflow').
														   populate('createdBy.user').
														   populate('editedBy.user').
    													   populate('groups.users').
			    										   populate('groups.group').
														   exec(function (error, _res) {
															   if (!error) {
																   i++;
																   console.log(i);
																   console.log(n);
																   res['data'] = res['data'].concat(_res1);
																   res['data'] = res['data'].concat(_res);
																   console.log(res['data']);
																   if (i == n) findTasksById(res['data'], 0);;
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
		var workflowsId = data?data.status:null;
        project.aggregate(
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
                        result.forEach(function(_project) {
                            switch (_project._id) {
                            case "everyOne":
                                {
                                    qeryEveryOne(_project.ID, result.length, workflowsId);
                                }
                                break;
                            case "owner":
                                {
                                    qeryOwner(_project.ID, result.length, workflowsId);
                                }
                                break;
                            case "group":
                                {
                                    qeryByGroup(_project.ID, result.length, workflowsId);
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

        var findTasksById = function (_projects, count) {
            try {
                if (_projects.length > count) {
                    var _resultProgress = returnProgress(_projects[count].task);
                    _projects[count].estimated = _resultProgress.estimated;
                    _projects[count].remaining = _resultProgress.remaining;
                    _projects[count].progress = _resultProgress.progress;
                    count++;
                    findTasksById(_projects, count);
                } else {
                    //projectFormatDate(_projects, 0, true);
                    res['data'] = _projects;
                    response.send(res);
                }
            }
            catch (Exception) {
                console.log(Exception);
                logWriter.log("Project.js getProjects findETasksById tasks.find " + Exception);
                response.send(500, { error: "Can't find Projects" });
            }
        }
    };

    function getById(data, response) {
        var query = project.findById(data.id, function (err, res) { });
        query.populate('projectmanager', 'name _id');
        query.populate('customer', 'name _id');
        query.populate('workflow').
            populate('createdBy.user').
            populate('editedBy.user');

        query.exec(function (err, project) {
            if (err) {
                logWriter.log("Project.js getProjectById project.find " + err);
                response.send(500, { error: "Can't find Project" });
            } else {
                response.send(project);
            }
        });
    };

    function update(_id, data, res) {
        try {
            delete data._id;
            delete data.createdBy;
            delete data.task;
            console.log(data);
            project.update({ _id: _id }, data, function (err, projects) {
                if (err) {
                    console.log(err);
                    logWriter.log("Project.js update project.update " + err);
                    res.send(500, { error: "Can't update Project" });
                } else {
                    tasks.find({ 'project.id': _id }, function (err, result) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Project.js update tasks.find " + err);
                            res.send(500, { error: "Can't update Project & tasks.find" });
                        } else {
                            if (result.length > 0) {
                                _updateTask(result, {
                                    'project.name': data.projectName,
                                    'project.projectShortDesc': data.projectShortDesc
                                });
                            }
                        }
                    });
                    res.send(200, { success: 'Project updated success' });
                }
            });
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Project.js update " + Exception);
            res.send(500, { error: 'Project updated error' });
        }
    };

    function remove(_id, res) {
        project.remove({ _id: _id }, function (err, projects) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js remove project.remove " + err);
                res.send(500, { error: "Can't remove Project" });
            } else {
                removeTasksByPorjectID(_id);
                res.send(200, { success: 'Remove all tasks Starting...' });
            }
        });
    };

    function removeTasksByPorjectID(_id) {
        tasks.find({ 'project': _id }, function (err, taskss) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js removeTasksByPorjectID task.find " + err);
            } else {
                for (var i in taskss) {
                    tasks.remove({ _id: taskss[i]._id }, function (errr, result) {
                        if (errr) {
                            console.log(err);
                            logWriter.log("Project.js removeTasksByPorjectID tasks.remove " + err);
                        }
                    });
                }
            }
        });
    };

    function createTask(data, res) {
        try {
            if (!data.summary || !data.project) {
                logWriter.log('Task.create Incorrect Incoming Data');
                res.send(400, { error: 'Task.create Incorrect Incoming Data' });
                return;
            } else {
                var projectId = data.project;
                var query = tasks.find({ project: projectId });
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
                    _task = new tasks({ taskCount: n });
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
                            project.findByIdAndUpdate(_task.project, { $push: { task: _task._id } }, function (err, doc) {
                                if (err) {
                                    console.log(err);
                                    res.send(500, { error: 'Project.save BD error' });
                                }
                            });
                            updateProjectTime(_task);
                            res.send(201, { success: 'An new Task crate success' });
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

    function updateTask(_id, data, res) {
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
            var query = tasks.find({ project: data.project });
            query.sort({ taskCount: -1 });
            query.exec(function (error, _tasks) {
                if (error) {
                    console.log(error);
                    logWriter.log("Project.js updateTask tasks.find doc.length === 0" + error);
                    res.send(500, { error: 'Task find error' });
                } else {
                    tasks.findById(_id, function (err, task) {
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
                            tasks.update({ _id: _id }, data, function (err, taskk) {
                                if (err) {
                                    console.log(err);
                                    logWriter.log("Project.js updateTask tasks.update " + err);
                                    res.send(500, { error: "Can't update Task" });
                                } else {
                                    res.send(200, { success: 'JobPosition updated success' });
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

    function removeTask(_id, res) {
        tasks.findById(_id, function (er, task) {
            if (task) {
                tasks.find({ 'project.id': task.project.id }, function (_er, docs) {
                    if (docs && docs.length == 0) {
                        project.update({ _id: task.project.id }, {
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
        tasks.remove({ _id: _id }, function (err, taskk) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js remove task.remove " + err);
                res.send(500, { error: "Can't remove Task" });
            } else {
                res.send(200, { success: 'Task removed' });
            }
        });
    };

    function getTasks(response) {
        var res = {};
        res['data'] = [];
        var query = tasks.find({});
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

    function getTasksPriority(response) {
        var res = {};
        res['data'] = [];
        priority.find({}, function (err, _priority) {
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

    function getTasksByProjectId(data, response) {
        var res = {};
        res['data'] = [];
        res['showMore'] = [];
        res['options'] = [];
        var optionsArray = [];
        var showMore = false;
        var i = 0;

        var qeryEveryOne = function (arrayOfId, n) {
            project.find().
                where('_id').in(arrayOfId).
                // populate("projectmanager customer task").
                // populate('workflow').
                // populate('createdBy.user').
                // populate('editedBy.user').
                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        console.log(i);
                        console.log(n);
                        res['data'] = res['data'].concat(_res);
                        console.log(res['data']);
                        if (i == n) {
                            qeryGetTasks(res['data'],data.parrentContentId);
                        }
                    }
                });
        };

        var qeryOwner = function (arrayOfId, n) {
            project.find().
                where('_id').in(arrayOfId).
                where({ 'groups.owner': data.uId }).
                //  populate("projectmanager customer task").
                //  populate('workflow').
                //  populate('createdBy.user').
                //  populate('editedBy.user').
                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        console.log(i);
                        console.log(n);
                        res['data'] = res['data'].concat(_res);
                        console.log(res['data']);
                        if (i == n) {
                            qeryGetTasks(res['data'],data.parrentContentId);
                        }
                    } else {
                        console.log(error);
                    }
                });
        };

        var qeryByGroup = function (arrayOfId, n) {
            project.find().
                where({ 'groups.users': data.uId }).
                //  populate("projectmanager customer task").
                //  populate('workflow').
                //  populate('createdBy.user').
                //  populate('editedBy.user').
                exec(function (error, _res1) {
                    if (!error) {
                        department.department.find({ users: data.uId }, { _id: 1 },
                            function (err, deps) {
                                console.log(deps);
                                if (!err) {
                                    project.find().
                                        where('_id').in(arrayOfId).
                                        where('groups.group').in(deps).
                                        //  populate("projectmanager customer task").
                                        //  populate('workflow').
                                        //  populate('createdBy.user').
                                        //  populate('editedBy.user').
                                        exec(function (error, _res) {
                                            if (!error) {
                                                i++;
                                                console.log(i);
                                                console.log(n);
                                                res['data'] = res['data'].concat(_res1);
                                                res['data'] = res['data'].concat(_res);
                                                console.log(res['data']);
                                                if (i == n) {
                                                    qeryGetTasks(res['data'],data.parrentContentId);
                                                }
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

        project.aggregate(
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
                        result.forEach(function(_project) {
                            switch (_project._id) {
                                case "everyOne":
                                {
                                    qeryEveryOne(_project.ID, result.length);
                                }
                                    break;
                                case "owner":
                                {
                                    qeryOwner(_project.ID, result.length);
                                }
                                    break;
                                case "group":
                                {
                                    qeryByGroup(_project.ID, result.length);
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

        var qeryGetTasks = function (projects, projectId) {
            var accessCheck = false;

            if (projects.length != 0) {
                for(var k = 0; k < projects.length; k++) {
                    if ((projects[k]._id == projectId) && (projectId)) {
                        accessCheck = true;
                        console.log('------------accessCheck-------------------------------------------');
                    };
                    projects[k] = new newObjectId(projects[k]._id.toString());
                }
            }

            if (accessCheck) {
                var queryAggregate = tasks.aggregate({ $match: { project: newObjectId(projectId) } }, { $group: { _id: "$workflow", taskId: { $push: "$_id" }, remaining: { $sum: "$remaining" } } });

            } else {
                var queryAggregate = tasks.aggregate({ $match: { project: {$in: projects} } },{ $group: { _id: "$workflow", taskId: { $push: "$_id" }, remaining: { $sum: "$remaining" } } });
            }

            queryAggregate.exec(
                function (err, responseTasks) {
                    if (!err) {
                        var responseTasksArray = [];
                        var columnValue = data.count;
                        var page = data.page;

                        responseTasks.forEach(function (value) {
                            value.taskId.forEach(function (idTask, taskIndex) {
                                if (((page - 1) * columnValue <= taskIndex) && (taskIndex < (page - 1) * columnValue + columnValue)) {
                                    responseTasksArray.push(idTask);
                                }
                            });
                            var myObj = {
                                id: value._id,
                                namberOfTasks: value.taskId.length,
                                remainingOfTasks: value.remaining
                            };
                            optionsArray.push(myObj);
                            if (value.taskId.length > ((page - 1) * columnValue + columnValue)) {
                                showMore = true;
                            }
                        });
                        tasks.find()
                            .where('_id').in(responseTasksArray)
                            .populate('project', '_id projectShortDesc projectName')
                            .populate('assignedTo', '_id name imageSrc')
                            .populate('extrainfo.customer createdBy.user editedBy.user')
                            .populate('workflow')
                            .populate('createdBy.user')
                            .populate('editedBy.user')
                            .exec(function (err, result) {
                                if (!err) {
                                    res['showMore'] = showMore;
                                    res['options'] = optionsArray;
                                    res['data'] = result;
                                    response.send(res);
                                } else {
                                    logWriter.log("Project.js getTasksByProjectId task.find " + err);
                                    response.send(500, { error: "Can't find Tasks" });
                                }
                            })
                    } else {
                        logWriter.log("Project.js getTasksByProjectId task.find " + err);
                        response.send(500, { error: "Can't group Tasks" });
                    }
                });

        }
    };

    function getTaskById(data, response) {
        var query = tasks.findById(data.id, function (err, res) { });
        query.populate('project', '_id projectShortDesc projectName').
            populate(' assignedTo', '_id name imageSrc').
            populate('createdBy.user editedBy.user').
            populate('createdBy.user').
            populate('editedBy.user');

        query.exec(function (err, task) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js getTasksByProjectId task.find " + err);
                response.send(500, { error: "Can't find Tasks" });
            } else {
                response.send(task);
            }
        });
    };

    function getTasksForList(data, response) {
        var res = {};
        res['data'] = [];
        var i = 0;
        var qeryEveryOne = function (arrayOfId, n) {
            var query = (data.parrentContentId) ? tasks.find({ 'project': newObjectId(data.parrentContentId) }) : tasks.find();
            query.where('_id').in(arrayOfId);
            if (data && data.status && data.status.length>0)
                query.where('workflow').in(data.status);
            query.populate('project', '_id projectShortDesc projectName').
                populate('assignedTo', '_id name imageSrc').
                populate('extrainfo.customer createdBy.user editedBy.user').
                populate('workflow').
                populate('createdBy.user').
                populate('editedBy.user').
                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        res['data'] = res['data'].concat(_res);
                        if (i == n) {
                            getOpportunities(res['data'], data);
                        }
                    }
                });
        };

        var qeryOwner = function (arrayOfId, n) {
            var query = (data.parrentContentId) ? tasks.find({ 'project': newObjectId(data.parrentContentId) }) : tasks.find();
            query.where('_id').in(arrayOfId).
                where({ 'groups.owner': data.uId });
            if (data && data.status && data.status.length>0)
                query.where('workflow').in(data.status);
            query.populate('project', '_id projectShortDesc projectName').
                populate('assignedTo', '_id name imageSrc').
                populate('extrainfo.customer createdBy.user editedBy.user').
                populate('workflow').
                populate('createdBy.user').
                populate('editedBy.user').

                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        res['data'] = res['data'].concat(_res);
                        if (i == n) {
                            getOpportunities(res['data'], data);
                        }
                    } else {
                        console.log(error);
                    }
                });
        };

        var qeryByGroup = function (arrayOfId, n) {
            var query = (data.parrentContentId) ? tasks.find({ 'project': newObjectId(data.parrentContentId) }) : tasks.find();
            query.where({ 'groups.users': data.uId });
            if (data && data.status && data.status.length>0)
                query.where('workflow').in(data.status);
            query.populate('project', '_id projectShortDesc projectName').
                populate('assignedTo', '_id name imageSrc').
                populate('extrainfo.customer createdBy.user editedBy.user').
                populate('workflow').
                populate('createdBy.user').
                populate('editedBy.user').

                exec(function (error, _res1) {
                    if (!error) {
                        department.department.find({ users: data.uId }, { _id: 1 },
                            function (err, deps) {
                                if (!err) {
                                    var query = (data.parrentContentId) ? tasks.find({ 'project': newObjectId(data.parrentContentId) }) : tasks.find();
                                    query.where('_id').in(arrayOfId).
                                        where('groups.group').in(deps);
                                    if (data && data.status && data.status.length>0)
                                        query.where('workflow').in(data.status);
                                    query.populate('project', '_id projectShortDesc projectName').
                                        populate('assignedTo', '_id name imageSrc').
                                        populate('extrainfo.customer createdBy.user editedBy.user').
                                        populate('workflow').
                                        populate('createdBy.user').
                                        populate('editedBy.user').
                                        exec(function (error, _res) {
                                            if (!error) {
                                                i++;
                                                res['data'] = res['data'].concat(_res1);
                                                res['data'] = res['data'].concat(_res);
                                                if (i == n) {
                                                    getOpportunities(res['data'], data);
                                                }
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

        tasks.aggregate(
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
                        result.forEach(function(_project) {
                            switch (_project._id) {
                                case "everyOne":
                                {
                                    qeryEveryOne(_project.ID, result.length);
                                }
                                    break;
                                case "owner":
                                {
                                    qeryOwner(_project.ID, result.length);
                                }
                                    break;
                                case "group":
                                {
                                    qeryByGroup(_project.ID, result.length);
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

        var getOpportunities = function(opportunitiesArray, data) {
            console.log('---------------loo-----');
            var opportunitiesArrayForSending = [];
            for (var k = (data.page - 1) * data.count; k <(data.page * data.count); k++) {
                if (k < opportunitiesArray.length) {
                    opportunitiesArrayForSending.push(opportunitiesArray[k]);
                }

            }
            res['listLength'] = opportunitiesArray.length;
            res['data'] = opportunitiesArrayForSending;
            response.send(res);
        }
    };

    return {
        create: create,//End create

        getForDd: getForDd,

        get: get,

        getById: getById,

        update: update,

        remove: remove,

        createTask: createTask,

        updateTask: updateTask,

        removeTask: removeTask,

        getTasks: getTasks,

        getTasksByProjectId: getTasksByProjectId,

        getTaskById: getTaskById,

        getTasksForList: getTasksForList,

        getTasksPriority: getTasksPriority,

        Project: Project
    };
};

module.exports = Project;
