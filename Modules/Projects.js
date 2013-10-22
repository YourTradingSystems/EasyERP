var Project = function (logWriter, mongoose) {

    var ProjectSchema = mongoose.Schema({
        projectShortDesc: { type: String, default: 'emptyProject' },
        projectName: { type: String, default: 'emptyProject' },
        task: {
            avaliable: { type: Boolean, default: false },
            tasks: { type: Array, default: [] }
        },
        privacy: { type: String, default: 'All Users' },
        customer: {
            id: { type: String, default: '' },
            type: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        projectmanager: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        teams: { users: { type: Array, default: [] }, Teams: { type: Array, default: [] } },
        info: {
            StartDate: Date,
            EndDate: Date,
            duration: Number,
            sequence: { type: Number, default: 0 },
            parent: { type: String, default: null }
        },
        workflow: {
            name: { type: String, default: 'New' },
            status: { type: String, default: 'New' }
        },
        color: { type: String, default: '#4d5a75' },
        estimated: { type: Number, default: 0 },
        logged: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 },
        progress: { type: Number, default: 0 }
    }, { collection: 'Project' });

    var TasksSchema = mongoose.Schema({
        summary: { type: String, default: '' },
        taskCount: { type: Number, default: 0 },
        project: {
            id: String,
            name: String,
            projectShortDesc: String
        },
        assignedTo: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        deadline: Date,
        tags: [String],
        description: String,
        extrainfo: {
            priority: { type: String, default: 'Medium' },
            sequence: { type: Number, default: 0 },
            customer: {
                id: { type: String, default: '' },
                name: { type: String, default: '' }
            },
            StartDate: Date,
            EndDate: Date,
            duration: Number
        },
        workflow: {
            name: { type: String, default: 'Analysis' },
            status: { type: String, default: 'New' }
        },
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
        for (var i in tasksArray) {

            if (tasksArray[i].workflow.status != 'Cancelled') {
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

    var projectFormatDate = function (_projects, count, bool) {
        try {
            if (bool) {
                if (_projects.length > count) {
                    var startday = _projects[count].info.StartDate.getDate();
                    var startmonth = _project[count].info.StartDate.getMonth() + 1;
                    var startyear = _project[count].info.StartDate.getFullYear();
                    var startdate = startday + "/" + startmonth + "/" + startyear;
                    _projects[count].info.StartDate = startdate;
                    var endday = _project[count].info.EndDate.getDate();
                    ;
                    var endmounth = _project[count].info.EndDate.getMounth() + 1;
                    var endyear = _project[count].info.EndDate.getFullYear();
                    var enddate = endday + "/" + endmounth + "/" + endyear;
                    _projects[count].info.EndDate = enddate;
                    console.log('=======Project Date Was Formated=================');
                    console.log("StartDate: " + startdate + " EndDate: " + enddate);
                    console.log('================================================');
                    count++;
                    projectFormatDate(_projects, count, true);
                } else {
                    projectFormatDate(_projects, count, false);
                }
            } else {
                return _projects;
            }
        } catch (exeption) {

        }
    };

    var taskFormatDate = function (_tasks, count) {
        try {
            if (_tasks.length > count) {
                if (_tasks[count].extrainfo.StartDate) {
                    var startday = _tasks[count].extrainfo.StartDate.getDate();
                    var startmonth = _tasks[count].extrainfo.StartDate.getMonth() + 1;
                    var startyear = _tasks[count].extrainfo.StartDate.getFullYear();
                    var startdate = startday + "/" + startmonth + "/" + startyear;
                    _tasks[count].extrainfo.StartDate = startdate;
                    console.log(startdate);
                } else {
                    _tasks[count].extrainfo.StartDate = '';
                }
                if (_tasks[count].extrainfo.EndDate) {
                    var endday = _tasks[count].extrainfo.EndDate.getDate();
                    var endmounth = _tasks[count].extrainfo.EndDate.getMonth() + 1;
                    var endyear = _tasks[count].extrainfo.EndDate.getFullYear();
                    var enddate = endday + "/" + endmounth + "/" + endyear;
                    _tasks[count].extrainfo.EndDate = enddate;
                    console.log(enddate);
                } else {
                    _tasks[count].extrainfo.EndDate = '';
                }
                count++;
                taskFormatDate(_tasks, count);
            } else {
                console.log(_tasks);
                return _tasks;
            }
        } catch (exeption) {
            console.log(exeption);
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
                        if (data.workflow.name) {
                            _project.workflow.name = data.workflow.name;
                        }
                        if (data.workflow.status) {
                            _project.workflow.status = data.workflow.status;
                        }
                    }
                    if (data.customer) {
                        if (data.customer._id) {
                            _project.customer.id = data.customer._id;
                        }
                        if (data.customer.name) {
                            _project.customer.name = (data.customer.name.first)
                                ? ((data.customer.name.last)
                                    ? data.customer.name.first + ' ' + data.customer.name.last
                                    : data.customer.name.first)
                                : '';
                        }
                        if (data.customer.type) {
                            _project.customer.type = data.customer.type;
                        }
                    }
                    if (data.projectmanager) {
                        if (data.projectmanager._id) {
                            _project.projectmanager.id = data.projectmanager._id;
                        }
                        if (data.projectmanager.name) {
                            _project.projectmanager.name = (data.projectmanager.name.first)
                                ? ((data.projectmanager.name.last)
                                    ? data.projectmanager.name.first + ' ' + data.projectmanager.name.last
                                    : data.projectmanager.name.first)
                                : '';
                        }
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
        var query = project.find({});
        query.sort({ projectName: 1 });
        query.exec(function (err, projects) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js getProjectsForDd project.find " + err);
                response.send(500, { error: "Can't find Project" });
            } else {
                res['data'] = projects;
                response.send(res);
            }
        });
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        var query = project.find({});
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
                    tasks.find({ 'project.id': _projects[count]._id }, function (err, taskss) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Project.js getProjects findETasksById tasks.find " + err);
                                response.send(500, { error: "Can't find Projects" });
                            } else {
                                _projects[count].task.tasks = taskss;
                                var _resultProgress = returnProgress(taskss);
                                _projects[count].estimated = _resultProgress.estimated;
                                _projects[count].remaining = _resultProgress.remaining;
                                _projects[count].progress = _resultProgress.progress;
                                count++;
                                findTasksById(_projects, count);
                            }
                        }
                        catch (Exception) {
                            console.log(Exception);
                            logWriter.log("Project.js getProjects findETasksById tasks.find " + Exception);
                            response.send(500, { error: "Can't find Projects" });
                        }
                    });
                } else {
                    projectFormatDate(_projects, 0, true);
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
            console.log(data);
            if (!data.summary || (!data.project || !data.project._id)) {
                logWriter.log('Task.create Incorrect Incoming Data');
                res.send(400, { error: 'Task.create Incorrect Incoming Data' });
                return;
            } else {
                var projectId = data.project._id;
                var query = tasks.find({ 'project.id': projectId });
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
                        if (data.project._id) {
                            _task.project.id = data.project._id;
                        }
                        if (data.project.projectName) {
                            _task.project.name = data.project.projectName;
                        }
                        if (data.project.projectShortDesc) {
                            _task.project.projectShortDesc = data.project.projectShortDesc;
                            _task.taskCount = n;
                        }
                    }
                    if (data.assignedTo) {
                        if (data.assignedTo._id) {
                            _task.assignedTo.id = data.assignedTo._id;
                        }
                        if (data.assignedTo.name) {
                            _task.assignedTo.name = data.assignedTo.name.first + ' ' + data.assignedTo.name.last;
                        }
                    }
                    if (data.deadline) {
                        _task.deadline = data.deadline;
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
                            if (data.extrainfo.customer._id) {
                                _task.extrainfo.customer.id = data.extrainfo.customer._id;
                            }
                            if (data.extrainfo.customer.name) {
                                _task.extrainfo.customer.name = data.extrainfo.customer.name.first + ' ' + data.extrainfo.customer.name.last;
                            }
                        }
                        if (data.extrainfo.StartDate) {
                            _task.extrainfo.StartDate = data.extrainfo.StartDate;
                        }
                        if (data.extrainfo.EndDate) {
                            _task.extrainfo.EndDate = data.extrainfo.EndDate;
                        }
                        if (data.extrainfo.StartDate) {
                            _task.extrainfo.duration = returnDuration(data.extrainfo.StartDate, data.extrainfo.EndDate);
                        }
                    }
                    if (data.workflow) {
                        if (data.workflow.name) {
                            _task.workflow.name = data.workflow.name;
                        }
                        if (data.workflow.status) {
                            _task.workflow.status = data.workflow.status;
                        }
                    }
                    if (data.estimated) {
                        _task.estimated = data.estimated;
                    }
                    if (data.logged) {
                        _task.logged = data.logged;
                    }
                    if (data.estimated) {
                        _task.remaining = data.estimated - data.logged;
                        if (_task.remaining != 0) {
                            _task.progress = Math.round((data.logged / data.estimated) * 100);
                        }
                    }
                    _task.save(function (err, _task) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Project.js createTask saveTaskToBd _task.save " + err);
                            res.send(500, { error: 'Task.save BD error' });
                        } else {
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
        }
        if (data.project && data.project.id) {
            var query = tasks.find({ 'project.id': data.project.id });
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
                            if (!_tasks[0] || (!task || (task.project.id != data.project.id))) {
                                var n = (_tasks[0]) ? ++_tasks[0].taskCount : 1;
                                data.taskCount = n;
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

    function getTasksByProjectId(data, func) {
        var res = {};
        res['result'] = {};
        res['result']['status'] = '2';
        res['result']['description'] = 'An error was find';
        res['data'] = [];
        var query = tasks.find({ project: data.id });
        query.sort({ summary: 1 });
        query.exec(function (err, taskss) {
            try {
                if (err) {
                    //func();
                    console.log(err);
                    logWriter.log("Project.js getTasksByProjectId tasks.find " + err);
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
                logWriter.log("Project.js getTasksByProjectId tasks.find " + Exception);
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