var Workflow = function (logWriter, mongoose) {

    var workflowSchema = mongoose.Schema({
        wId: String,
        wName: String,
        status: String,
        name: String,
        color: { type: String, default: "#2C3E50" },
        sequence: Number
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
                    workflow.find({ $and: [{ wId: data._id }, { wName: data.wName }] }, function (err, workflows) {
                        if (err) {
                            console.log(err);
                            logWriter.log('WorkFlow.js create workflow.find ' + err);
                            result.send(400, { error: 'WorkFlow.js create workflow Incorrect Incoming Data' });
                            return;
                        } else {
                            console.log(workflows);
                            if (workflows[0]) {
                                result.send(500, { error: 'WorkFlow.js create save error' });
                            } else {
                                try {

                                    for (var i = 0; i < data.value.length; i++) {
                                        _workflow = new workflow();
                                        _workflow.wId = data._id;
                                        _workflow.wName = data.wName;
                                        _workflow.name = data.value[i].name;
                                        _workflow.status = data.value[i].status;
                                        _workflow.sequence = data.value[i].sequence;

                                        _workflow.save(function(err, workfloww) {
                                            if (err) {
                                                console.log(err);
                                                logWriter.log('WorkFlow.js create workflow.find _workflow.save ' + err);
                                                result.send(500, { error: 'WorkFlow.js create save error' });
                                            } else {
                                                result.send(201, { success: 'A new WorkFlow crate success' });
                                            }
                                        });
                                    }
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
            console.log('>>>>>>>Incoming Workflow Update>>>>>>>');
            console.log(data);
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

        getWorkflowsForDd: function (data, response) {
            var res = {};
            res['data'] = [];
            //var query = workflow.find({ $and: [{ wId: data.type.id }, { name: data.type.name }] });
            var query = workflow.find({ wId: data.type.id });
            //query.sort({ 'name': 1 });
            query.exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log('Workflow.js get workflow.find' + err);
                    response.send(500, { error: "Can't find Workflow" });
                } else {
                    //res['data'] = result[0].value;
                    res['data'] = result;
                    console.log(result);
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
        },
        workflow:workflow
    };
};

module.exports = Workflow;