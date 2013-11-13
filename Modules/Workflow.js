var Workflow = function (logWriter, mongoose) {

    var workflowSchema = mongoose.Schema({
        wId: String,
        name: String,
        value: { type: Array, default: [] }
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
                    workflow.find({ $and: [{ wId: data._id }, { name: data.name }] }, function (err, workflows) {
                        if (err) {
                            console.log(err);
                            logWriter.log('WorkFlow.js create workflow.find ' + err);
                            result.send(400, { error: 'WorkFlow.js create workflow Incorrect Incoming Data' });
                            return;
                        } else {
                            console.log(workflows);
                            if (workflows[0] && workflows[0].name == data.name) {
                                workflow.update({ _id: workflows[0]._id }, { $push: { value: data.value } }, function (err, res) {
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

        update: function (_id, data, result) {
            try {
                if (data) {
                    delete data._id;
                    workflow.update({ _id: _id }, data, function (err, res) {
                        if (err) {
                            console.log(err);
                            logWriter.log('WorkFlow.js update workflow.update ' + err);
                            result.send(400, { error: 'WorkFlow.js update workflow error ' });
                            return;
                        } else {
                            console.log(res);
                            result.send(200, { success: 'WorkFlow update success' });
                        }
                    });
                }
            }
            catch (exception) {
                logWriter.log("Workflow.js  create " + exception);
            }
        },
        getTasksforDd: function (data, response) {
            var res = {};
            res['data'] = [];
            var query = workflow.find({wId: 'Task'},{ value:1 });
            //query.select('_id name imageSrc');
            //query.sort({ 'name': 1 });
            query.exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log('Workflow.js get workflow.find' + err);
                    response.send(500, { error: "Can't find Workflow" });
                } else {
                    res['data'] = result;
                    response.send(res);
                }
            });
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