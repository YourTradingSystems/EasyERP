var Workflow = function (logWriter, mongoose) {

    var workflowSchema = mongoose.Schema({
        wId: String,
        name: String,
        value: [{
            name: { type: String, default: '' },
            status: { type: String, default: 'New' },
            sequence: { type: Number, default: 0 },
            color: { type: String, default: '#2C3E50' }
        }]
    }, { collection: 'workflows' });

    var relatedStatusSchema = mongoose.Schema({
        _id: Number,
        status: String
    }, { collection: 'relatedStatus' });

    var workflow = mongoose.model('workflows', workflowSchema);
    var rStatus = mongoose.model('relatedStatus', relatedStatusSchema);

    return {
        create: function (data, result) {
            try {
                if (data) {
                    workflow.find({ wId: data._id }, function (err, workflows) {
                        if (err) {
                            console.log(err);
                            logWriter.log('WorkFlow.js create workflow.find ' + err);
                            result.send(400, { error: 'WorkFlow.js create workflow Incorrect Incoming Data' });
                            return;
                        } else {
                            if (workflows[0] && workflows[0].name == data.name) {
                                workflow.update({ wId: workflows[0].wId }, { $push: { value: data.value } }, function (err, res) {
                                    console.log(res);
                                    result.send(200, { success: 'WorkFlow updated success' });
                                });
                            } else {
                                try {
                                    _workflow = new workflow();
                                    _workflow.wId = data._id;
                                    _workflow.name = data.name;
                                    _workflow.value = data.value;
                                    _workflow.color = data.color;
                                    _workflow.save(function (err, workfloww) {
                                        if (err) {
                                            console.log(err);
                                            logWriter.log('WorkFlow.js create workflow.find _workflow.save ' + err);
                                            result.send(500, { error: 'WorkFlow.js create save error' });
                                        } else {
                                            result.send(201, { success: 'A new WorkFlow crate success' });
                                        }
                                    });
                                }
                                catch (err) {
                                    console.log(err);
                                    logWriter.log('WorkFlow.js create _workflow.save ' + err);
                                    result.send(500, { error: 'WorkFlow.js create error' });
                                }
                            }
                        }
                    });
                }
            }
            catch (exception) {
                logWriter.log("Workflow.js  create " + exception);
            }
        },

        get: function (data, response) {
            try {
                var res = {};
                res['data'] = [];
                if (data) {
                    var query = (data.id) ? { wId: data.id } : {};
                    workflow.find(query, function (err, result) {
                        if (err) {
                            console.log(err);
                            logWriter.log('WorkFlow.js create workflow.find ' + err);
                            response.send(500, { error: "Can't find Workflow" });
                        } else {
                            res['data'] = result;
                            response.send(res);
                        }
                    });
                }
            }
            catch (exception) {
                console.log(exception);
                logWriter.log("Workflow.js  create " + exception);
                response.send(500, { error: "Can't find Workflow" });
            }
        },

        getRelatedStatus: function (response) {
            try {
                var res = {};
                res['data'] = [];
                rStatus.find({}, function (err, _statuses) {
                    if (err) {
                        console.log(err);
                        logWriter.log('WorkFlow.js getRelatedStatus ' + err);
                        response.send(500, { error: "Can't find relatedStatus " });
                    } else {
                        res['data'] = _statuses;
                        response.send(res);
                    }
                });
            }
            catch (exception) {
                console.log(exception);
                logWriter.log("Workflow.js  create " + exception);
                response.send(500, { error: "Can't find Workflow" });
            }
        }
    };
};

module.exports = Workflow;