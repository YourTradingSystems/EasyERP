var SourcesOfApplicants = function (logWriter, mongoose) {
    var SourcesOfApplicantsSchema = mongoose.Schema({
        _id: { type: String, default: '' },
        name: { type: String, default: '' }
    }, { collection: 'SourcesOfApplicants' });

    var sourcesofapplicants = mongoose.model('SourcesOfApplicants', SourcesOfApplicantsSchema);

    function create(data, res) {
        try {
            if (!data) {
                logWriter.log('JobPosition.create Incorrect Incoming Data');
                res.send(400, { error: 'JobPosition.create Incorrect Incoming Data' });
                return;
            } else {
                sourcesofapplicants.findById(data.name, function (err, result) {
                    if (err) {
                        logWriter.log('SourcesOfApplicants.js create workflow.find ' + err);
                    } else {
                        if (result) {
                            res.send(400, { error: 'An SourcesOfApplicants with the same Name already exists' });
                        } else {
                            try {
                                _sourcesofapplicants = new sourcesofapplicants();
                                _sourcesofapplicants._id = data.name;
                                _sourcesofapplicants.name = data.name;
                                _sourcesofapplicants.save(function (err, result) {
                                    if (err) {
                                        console.log(err);
                                        res.send(500, { error: 'SourcesOfApplicants.save BD error' });
                                        logWriter.log('SourcesOfApplicants.js create SourcesOfApplicants.find _sourcesofapplicants.save ' + err);
                                    } else {
                                        res.send(201, { success: 'A new SourcesOfApplicants crate success' });
                                    }
                                });
                            }
                            catch (err) {
                                console.log(err);
                                logWriter.log('SourcesOfApplicants.js create _degree.save ' + err);
                                res.send(500, { error: 'SourcesOfApplicants.save BD error' });
                            }
                        }
                    }
                });
            }
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("SourcesOfApplicants.js  " + Exception);
            res.send(500, { error: 'SourcesOfApplicants.save  error' });
        }
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        var query = sourcesofapplicants.find({});
        query.sort({ name: 1 });
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Sourcesofapplicants.js getSourcesofapplicants sourcesofapplicants.find " + err);
                response.send(500, { error: "Can't find Sourcesofapplicants" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function update(_id, data, res) {
        try {
            delete data._id;
            sourcesofapplicants.update({ _id: _id }, data, function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("Sourcesofapplicants.js update sourcesofapplicants.update" + err);
                    res.send(500, { error: "Can't update SourcesofApplicants" });
                } else {
                    res.send(200, { success: 'SourcesofApplicants updated success' });
                }
            });
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("SourcesofApplicants.js update " + exception);
            res.send(500, { error: 'SourcesofApplicants updated error' });
        }
    };

    function remove(_id, res) {
        sourcesofapplicants.remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Sourcesofapplicants.js remove sourcesofapplicants.remove " + err);
                res.send(500, { error: "Can't remove Sourcesofapplicants" });
            } else {
                res.send(200, { success: 'JobPosition removed' });
            }
        });
    };


    return {

        create: create,

        get: get,

        update: update,

        remove: remove,

        sourcesofapplicants: sourcesofapplicants
    };
};
module.exports = SourcesOfApplicants;