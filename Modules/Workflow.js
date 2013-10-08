var Workflow = function (logWriter, mongoose) {

    var workflowSchema = mongoose.Schema({
        _id: String,
        value: [{
            name: { type: String, default: '' },
            status: { type: String, default: 'New' },
            sequence: { type: Number, default: 0 }
        }]
    }, { collection: 'workflows' });

    var workflow = mongoose.model('workflows', workflowSchema);

    return {

        create: function (data, func) {
            try {
                if (data) {
                    workflow.findById(data.name, function (err, workflows) {
                        if (err) {
                            logWriter.log('WorkFlow.js create workflow.find ' + err);
                        } else {
                            if (workflows) {
                                workflow.update({ _id: workflows._id }, { $push: { value: data.value } }, function (err, res) {
                                    console.log(res);
                                });
                            } else {
                                try {
                                    _workflow = new workflow();
                                    _workflow._id = data.name;
                                    _workflow.value = data.value;
                                    _workflow.save(function (err, workfloww) {
                                        if (err) {
                                            logWriter.log('WorkFlow.js create workflow.find _workflow.save ' + err);
                                        } else {
                                            console.log(workfloww);
                                        }
                                    });
                                }
                                catch (err) {
                                    logWriter.log('WorkFlow.js create |_workflow.save ' + err);
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
                    workflow.findById(data.id, function (err, result) {
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
        }
    };
};

module.exports = Workflow;