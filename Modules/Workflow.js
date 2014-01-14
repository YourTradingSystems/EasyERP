var Workflow = function (logWriter, mongoose, models) {

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

    mongoose.model('workflows', workflowSchema);
    mongoose.model('relatedStatus', relatedStatusSchema);

    return {
        create: function (req, data, result) {
            try {
                if (data) {
                    console.log(data);
                    models.get(req.session.lastDb - 1, "workflows", workflowSchema).find({ $and: [{ wId: data._id }, { wName: data.wName }] }, function (err, workflows) {
                        if (err) {
                            console.log(err);
                            logWriter.log('WorkFlow.js create workflow.find ' + err);
                            result.send(400, { error: 'WorkFlow.js create workflow Incorrect Incoming Data' });
                            return;
                        } else {
                            for (var i = 0; i < data.value.length; i++) {
                                _workflow = new models.get(req.session.lastDb - 1, "workflows", workflowSchema)();
                                _workflow.wId = data._id;
                                _workflow.wName = data.wName;
                                _workflow.name = data.value[i].name;
                                _workflow.status = data.value[i].status;
                                _workflow.sequence = data.value[i].sequence;
                                _workflow.save(function (err, workfloww) {
                                    if (err) {
                                        console.log(err);
                                        logWriter.log('WorkFlow.js create workflow.find _workflow.save ' + err);
                                        result.send(500, { error: 'WorkFlow.js create save error' });
                                    } else {
                                        result.send(201, { success: 'A new WorkFlow crate success' });
                                        console.log(workfloww);
                                    }
                                });
                            }
                        }

                    });
                }
            }
            catch (exception) {
                logWriter.log("Workflow.js  create " + exception);
            }
        },

        update: function (req, _id, data, result) {
            console.log('>>>>>>>Incoming Workflow Update>>>>>>>');
            console.log(data);
            try {
                if (data) {
                    delete data._id;
                    models.get(req.session.lastDb - 1, "workflows", workflowSchema).update({ _id: _id }, data, function (err, res) {
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

        getWorkflowsForDd: function (req, data, response) {
            var res = {};
            res['data'] = [];
            //var query = workflow.find({ $and: [{ wId: data.type.id }, { name: data.type.name }] });
            var query = models.get(req.session.lastDb - 1, "workflows", workflowSchema).find({ wId: data.type.id });
            query.sort({ 'sequence': 1 });
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

        get: function (req, data, response) {
            try {
                var res = {};
                res['data'] = [];
                if (data) {
                    var query = (data.id) ? { wId: data.id } : {};
                    var query2 = models.get(req.session.lastDb - 1, "workflows", workflowSchema).find(query);
                    query2.sort({ 'sequence': 1 });
                    query2.exec(query, function (err, result) {
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

        getRelatedStatus: function (req, response, data) {
            try {
                var res = {};
                res['data'] = [];
                var queryObj = {type:null};
                models.get(req.session.lastDb - 1, "relatedStatus", relatedStatusSchema).find({}, function (err, _statuses) {
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

        remove: function (req, _id, res) {
            models.get(req.session.lastDb - 1, "workflows", workflowSchema).remove({ _id: _id }, function (err, workflow) {
                if (err) {
                    console.log(err);
                    logWriter.log("workflow.js remove workflow.remove " + err);
                    res.send(500, { error: "Can't remove Company" });
                } else {
                    res.send(200, { success: 'workflow removed' });
                }
            });
        },
        workflowSchema: workflowSchema
    };
};

module.exports = Workflow;