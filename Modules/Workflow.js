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
	function updateSequence (model, sequenceField, start, end, wId, isCreate, isDelete, callback) {
        var query;
        var objFind = {};
        var objChange = {};

        if (!(isCreate || isDelete)) {
            var inc = -1;
            if (start > end) {
                inc = 1;
                var c = end;
                end = start;
                start = c;
            } else {
                end -= 1;
            }
            objChange = {};
            objFind = { "wId": wId };
            objFind[sequenceField] = { $gte: start, $lte: end };
            objChange[sequenceField] = inc;
            query = model.update(objFind, { $inc: objChange }, { multi: true });
            query.exec(function (err, res) {
				console.log(res);
                if (callback) callback((inc == -1) ? end : start);
            });
        } else {
            if (isCreate) {
                query = model.count({ "wId": wId }).exec(function (err, res) {
                    if (callback) callback(res);
                });
            }
            if (isDelete) {
                objChange = {};
                objFind = { "wId": wId };
                objFind[sequenceField] = { $gt: start };
                objChange[sequenceField] = -1;
                query = model.update(objFind, { $inc: objChange }, { multi: true });
                query.exec(function (err, res) {
                    if (callback) callback(res);
                });
            }
        }

    }
    return {
        create: function (req, data, result) {
            try {
                if (data) {
                    models.get(req.session.lastDb - 1, "workflows", workflowSchema).find({ $and: [{ wId: data._id },{name: data.value[0].name}] }, function (err, workflows) {
                        if (err) {
                            console.log(err);
                            logWriter.log('WorkFlow.js create workflow.find ' + err);
                            result.send(400, { error: 'WorkFlow.js create workflow Incorrect Incoming Data' });
                            return;
                        } else {
                               //add vasya no not create workflow with the same name
                               if (workflows.length > 0) {//add vasya no not create workflow with the same name
                                     if (workflows[0].name === data.value[0].name) {//add vasya no not create workflow with the same name
                                            result.send(400, { error: 'An Workflows with the same Name already exists' });//add vasya no not create workflow with the same name
                                     }
                               }
                               else if(workflows.length === 0) {

                               for (var i = 0; i < data.value.length; i++) {
                                    var _workflow = new models.get(req.session.lastDb - 1, "workflows", workflowSchema)();
                                    _workflow.wId = data._id;
                                    _workflow.wName = data.wName;
                                    _workflow.name = data.value[i].name;
                                    _workflow.status = data.value[i].status;
                                    updateSequence(models.get(req.session.lastDb - 1, "workflows", workflowSchema), "sequence", 0, 0, data._id, true, false, function(sequence){
                                        _workflow.sequence = sequence;
                                    _workflow.save(function (err, workfloww) {
                                        if (err) {
                                            console.log(err);
                                            logWriter.log('WorkFlow.js create workflow.find _workflow.save ' + err);
                                            result.send(500, { error: 'WorkFlow.js create save error' });
                                        } else {
                                            result.send(201, { success: 'A new WorkFlow crate success', id: workfloww._id });
                                        }
                                    });
                                    });
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

        update: function (req, _id, data, result) {
            console.log('>>>>>>>Incoming Workflow Update>>>>>>>');
            
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
                            
                            result.send(200, { success: 'WorkFlow update success' });
                        }
                    });
                }
            }
            catch (exception) {
                logWriter.log("Workflow.js  create " + exception);
            }
        },
        updateOnlySelectedFields: function (req, _id, data, result) {
			console.log('>>>>>>>Incoming Workflow Update>>>>>>>');
            try {
                if (data) {
					updateSequence(models.get(req.session.lastDb - 1, "workflows", workflowSchema), "sequence", data.sequenceStart, data.sequence, data.wId, false, false, function(sequence){
						data.sequence = sequence;
						models.get(req.session.lastDb - 1, "workflows", workflowSchema).findByIdAndUpdate( _id, {$set:data}, function (err, res) {
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
            query.select('name wName');
            query.sort({ 'sequence': -1,"editedBy.date":-1 });
            query.exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log('Workflow.js get workflow.find' + err);
                    response.send(500, { error: "Can't find Workflow" });
                } else {
                    //res['data'] = result[0].value;
                    res['data'] = result;
                    
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
                    if (data.name) query['name'] = data.name
                    var query2 = models.get(req.session.lastDb - 1, "workflows", workflowSchema).find(query);
                    query2.sort({ 'sequence': -1,"editedBy.date":-1 });
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

        getContractEnd: function (req, data, response) {
            try {
                var res = {};
                res['data'] = [];
                if (data) {
                    var query = (data.id) ? { wId: data.id } : {};
                    if (data.name) query['name'] = data.name
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
            models.get(req.session.lastDb - 1, "workflows", workflowSchema).findByIdAndRemove( _id, function (err, workflow) {
                if (err) {
                    console.log(err);
                    logWriter.log("workflow.js remove workflow.remove " + err);
                    res.send(500, { error: "Can't remove Company" });
                } else {
					updateSequence(models.get(req.session.lastDb - 1, "workflows", workflowSchema), "sequence", workflow.sequence, workflow.sequence, workflow.wId, false, true, function(sequence){
						res.send(200, { success: 'workflow removed' });
					});
                }
            });
        },
        workflowSchema: workflowSchema
    };
};

module.exports = Workflow;
