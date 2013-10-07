var Degrees = function (logWriter, mongoose) {
    var degreesSchema = mongoose.Schema({
        _id: { type: String, default: '' },
        name: { type: String, default: '' }
    }, { collection: 'Degrees' });
    var degree = mongoose.model('Degrees', degreesSchema);

    function create(data, res) {
        try {
            if (typeof (data.name) == 'undefined') {
                logWriter.log('Degree.create Incorrect Incoming Data');
                res.send(400, { error: 'Degree.create Incorrect Incoming Data' });
                return;
            } else {
                degree.findById(data.name, function (err, degrees) {
                    if (err) {
                        logWriter.log('Degrees.js create degree.find ' + err);
                    } else {
                        if (degrees) {
                            res.send(400, { error: 'An Degree with the same Name already exists' });
                        } else {
                            try {
                                _degree = new degree();
                                _degree._id = data.name;
                                _degree.name = data.name;
                                _degree.save(function (err, degreess) {
                                    if (err) {
                                        console.log(err);
                                        res.send(500, { error: 'Degree.save BD error' });
                                        logWriter.log('Degree.js create degree.find _degree.save ' + err);
                                    } else {
                                        res.send(201, { success: 'A new Degree crate success' });
                                    }
                                });
                            }
                            catch (Exception) {
                                console.log(Exception);
                                logWriter.log("Degree.js  create " + Exception);
                                res.send(500, { error: 'Degree.save  error' });
                            }
                        }
                    }
                });
            }
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Degree.js  create " + Exception);
            res.send(500, { error: 'Degree.save  error' });
        }
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        degree.find({}, function (err, degrees) {
            if (err) {
                console.log(err);
                logWriter.log("Degrees.js getDegrees degrees.find " + err);
                response.send(500, { error: "Can't find JobPosition" });
            } else {
                res['data'] = degrees;
                response.send(res);
            }
        });
    };

    function update(_id, data, res) {
        try {
            delete data._id;
            degree.update({ _id: _id }, data, function (err, degreess) {
                if (err) {
                    console.log(err);
                    logWriter.log("Degrees.js update degree.update" + err);
                    res.send(500, { error: "Can't update Degrees" });
                } else {
                    res.send(200, { success: 'Degree updated success' });
                }
            });
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Degree.js update " + Exception);
            res.send(500, { error: 'Degree updated error' });
        }
    };

    function remove(_id, res) {
        degree.remove({ _id: _id }, function (err, degreess) {
            if (err) {
                console.log(err);
                logWriter.log("Degree.js remove degree.remove " + err);
                res.send(500, { error: "Can't remove Degree" });
            } else {
                res.send(200, { success: 'Degree removed' });
            }
        });
    };


    return {

        get: get,
        create: create,
        update: update,
        remove: remove,

        degree: degree
    };
};
module.exports = Degrees;