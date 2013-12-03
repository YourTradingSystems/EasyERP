var Project = function (logWriter, mongoose) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var ProjectSchema = mongoose.Schema({
        projectShortDesc: { type: String, default: 'emptyProject' },
        projectName: { type: String, default: 'emptyProject' },
        task: [{ type: ObjectId, ref: 'Tasks', default: null }],
        privacy: { type: String, default: 'All Users' },
        customer: { type: ObjectId, ref: 'Customers', default: null },
        projectmanager: { type: ObjectId, ref: 'Employees', default: null },
        teams: {
            users: { type: Array, default: [] },
            Teams: { type: Array, default: [] }
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
        progress: { type: Number, default: 0 }
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
            priority: { type: String, default: 'Medium' },
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
        progress: { type: Number, default: 0 }
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
                project.findById(task.project.id)
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
                    if (data.task) {
                        _project.task = data.task;
                    }
                    if (data.color) {
                        _project.color = data.color;
                    }
                    if (data.privacy) {
                        _project.privacy = data.privacy;
                    }
                    if (data.teams) {
                        _project.teams = data.teams;
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

    function get(response) {
        var res = {};
        res['data'] = [];
        var query = project.find({});
        query.populate("projectmanager customer task").populate('workflow');
        query.sort({ projectName: 1 });
        query.exec(function (err, projects) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js getProjects project.find " + err);
                response.send(500, { error: "Can't find JobPosition" });
            } else {
                console.log(projects);
                findTasksById(projects, 0);
            }
        });

        var findTasksById = function (_projects, count) {//���������� �������
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
                //response.send(500, { error: "Can't find Projects" });
            }
        }
    };

    function getById(_id, response) {
        var res = {};
        res['data'] = [];
        var query = project.findById(_id);
        query.exec(function (err, project) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js getProjects project.find " + err);
                response.send(500, { error: "Can't find JobPosition" });
            } else {
                console.log(project);
                response.send(project);
            }
        });
    };

    function update(_id, data, res) {
        try {
            delete data._id;
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
        tasks.find({ 'project.id': _id }, function (err, taskss) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js removeTasksByPorjectID task.find " + err);
            } else {
                for (var i in taskss) {
                    tasks.remove({ _id: taskss[i]._id, }, function (errr, result) {
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
                        saveTaskToBd(data, n);
                    }
                });
            }
            function saveTaskToBd(data, n) {
                try {
                    console.log(data);
                    _task = new tasks();
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
                            _task.extrainfo.priority = data.extrainfo.priority.priority;
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
        query.populate('project assignedTo extrainfo.customer workflow');
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
        var query = (data.parrentContentId) ? tasks.find({ project: data.parrentContentId }) : tasks.find({});
        query.populate('project', '_id projectShortDesc projectName')
            .populate('assignedTo', '_id name imageSrc')
            .populate('extrainfo.customer')
            .populate('workflow');
        query.skip((data.page - 1) * data.count).limit(data.count);
        query.sort({ summary: 1 });
        query.exec(function (err, _tasks) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js getTasksByProjectId task.find " + err);
                response.send(500, { error: "Can't find Tasks" });
            } else {
                //res['data'] = taskFormatDate(_tasks, 0);
                res['data'] = _tasks;
                console.log(res['data']);
                console.log(data.page);
                console.log(data.count);
                console.log(data.parrentContentId);
                response.send(res);
            }
        });
    };

    function getTaskById(data, func) {
        var res = {};
        res['result'] = {};
        res['result']['status'] = '2';
        res['result']['description'] = 'An error was find';
        res['data'] = {};
        tasks.findById(data.tid, function (err, taskss) {
            try {
                if (err) {
                    //func();
                    console.log(err);
                    logWriter.log("Project.js getTaskById tasks.findById " + err);
                    res['result']['description'] = err;
                    func(res);
                } else {
                    if (taskss) {
                        console.log(taskss);
                        res['result']['status'] = '0';
                        res['result']['description'] = 'returned Tasks is success';
                        res['data'] = taskss;
                        func(res);
                    }
                }
            }
            catch (Exception) {
                logWriter.log("Project.js getTaskById tasks.findById " + Exception);
            }
        });
    }

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

        getTasksPriority: getTasksPriority,

        Project: Project
    };
};

module.exports = Project;