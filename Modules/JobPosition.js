var JobPosition = function (logWriter, mongoose, employee) {

    var jobPositionSchema = mongoose.Schema({
        name: { type: String, default: '' },
        expectedRecruitment: { type: Number, default: 0 },
        interviewForm: {
            id: String,
            name: String
        },
        department: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        description: String,
        requirements: String,
        workflow: {
            name: { type: String, default: 'No Recruitment' },
            status: { type: String, default: 'New' }
        },
        numberOfEmployees: { type: Number, default: 0 },
        totalForecastedEmployees: { type: Number, default: 0 }
    }, { collection: 'JobPosition' });

    var job = mongoose.model('JobPosition', jobPositionSchema);

    function create(data, res) {
        try {
            if (!data) {
                logWriter.log('JobPosition.create Incorrect Incoming Data');
                res.send(400, { error: 'JobPosition.create Incorrect Incoming Data' });
                return;
            } else {
                var query = { name: data.name };
                job.find(query, function (error, doc) {
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
                    _job = new job();
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
                        if (data.department._id) {
                            _job.department.id = data.department._id;
                        }
                        if (data.department.departmentName) {
                            _job.department.name = data.department.departmentName;
                        }
                    }
                    if (data.description) {
                        _job.description = data.description;
                    }
                    if (data.requirements) {
                        _job.requirements = data.requirements;
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

    function get(response) {
        var res = {};
        res['data'] = [];
        var query = job.find({});
        query.sort({ name: 1 });
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('JobPosition.js get job.find' + err);
                response.send(500, { error: "Can't find JobPosition" });
            } else {
                getTotalEmployees(result, 0);
                //console.log(res);
                //response.send(res);
            }
        });
        var getTotalEmployees = function (jobPositions, count) {
            if (jobPositions && jobPositions.length > count) {
                employee.employee.find({ 'jobPosition.name': jobPositions[count].name }, function (err, _employees) {
                    if (err) {
                        console.log(err);
                        res['data'] = jobPositions;
                        response.send(res);
                    } else {
                        jobPositions[count].numberOfEmployees = _employees.length;
                        jobPositions[count].totalForecastedEmployees = jobPositions[count].expectedRecruitment + _employees.length;
                        count++;
                        getTotalEmployees(jobPositions, count);
                    }
                });
            } else {
                res['data'] = jobPositions;
                response.send(res);
            }
        }
    }; //end get

    function update(_id, data, res) {
        try {
            delete data._id;
            job.update({ _id: _id }, data, function (err, result) {
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

    function remove(_id, res) {
        job.remove({ _id: _id }, function (err, result) {
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
        create: create,

        get: get,

        update: update,

        remove: remove,

        job: job
    };
};

module.exports = JobPosition;