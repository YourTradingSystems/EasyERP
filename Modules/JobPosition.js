var JobPosition = function (logWriter, mongoose) {

    var jobPositionSchema = mongoose.Schema({
        name: { type: String, default: '' },
        expectedRecruitment: { type: Number, default: 0 },
        interviewForm: {
            id: String,
            name: String
        },
        department: {
            id: String,
            name: String
        },
        description: String,
        requirements: String,
        workflow: {
            name: { type: String, default: 'No Recruitment' },
            status: { type: String, default: 'New' }
        }
    }, { collection: 'JobPosition' });

    var job = mongoose.model('JobPosition', jobPositionSchema);

    function create(data, res) {
        try {
            if (typeof (data) == 'undefined') {
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
                        savetoDB(data);
                    }
                });
            }
            function savetoDB(data) {
                try {
                    _job = new job();
                    if (typeof (data.name) != 'undefined') {
                        _job.name = data.name;
                    }
                    if (typeof (data.expectedRecruitment) != 'undefined') {
                        _job.expectedRecruitment = data.expectedRecruitment;
                    }
                    if (typeof (data.interviewForm) != 'undefined') {
                        if (typeof (data.interviewForm.id) != 'undefined') {
                            _job.interviewForm.id = data.interviewForm.id;
                        }
                        if (typeof (data.interviewForm.name) != 'undefined') {
                            _job.interviewForm.name = data.interviewForm.name;
                        }
                    }
                    if (typeof (data.department) != 'undefined') {
                        if (typeof (data.department.id) != 'undefined') {
                            _job.department.id = data.department.id;
                        }
                        if (typeof (data.department.name) != 'undefined') {
                            _job.department.name = data.department.name;
                        }
                    }
                    if (typeof (data.description) != 'undefined') {
                        _job.description = data.description;
                    }
                    if (typeof (data.requirements) != 'undefined') {
                        _job.requirements = data.requirements;
                    }
                    _job.save(function (err, _jobPosition) {
                        if (err) {
                            console.log(err);
                            logWriter.log("JobPosition.js create savetoDB _job.save " + err);
                            res.send(500, { error: 'JobPosition.save BD error' });
                        } else {
                            res.send(201, { success: 'A new JobPosition crate success' });
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
        catch (Exception) {
            console.log(Exception);
            logWriter.log("JobPosition.js  " + Exception);
            res.send(500, { error: 'JobPosition.save  error' });
        }
    };//End create

    function get(response) {
        var res = {};
        res['data'] = [];
        job.find({}, function (err, jobPositions) {
            if (err) {
                console.log(err);
                logWriter.log('JobPosition.js get job.find' + err);
                response.send(500, { error: "Can't find JobPosition" });
            } else {
                res['data'] = jobPositions;
                response.send(res);
            }
        });
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
        catch (Exception) {
            console.log(Exception);
            logWriter.log("JobPosition.js update " + Exception);
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