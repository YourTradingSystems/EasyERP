// JavaScript source code
var Events = function (logWriter, mongoose) {

    var eventsSchema = mongoose.Schema({
        _id: Number,
        subject: { type: String, default: '' },
        description: { type: String, default: '' },
        eventType: { type: String, default: '' },
        start_date: Date,
        end_date: Date,
        assignTo: { type: String, default: '' },
        status: { type: String, default: '' }
    }, { collection: 'Events' });

    var event = mongoose.model('Events', eventsSchema);

    function create(data, res) {
        try {
            if (!data || !data.id) {
                logWriter.log('Events.create Incorrect Incoming Data');
                res.send(400, { error: 'Events.create Incorrect Incoming Data' });
                return;
            } else {
                savetoDb(data);
            }
            function savetoDb(data) {
                try {
                    console.log(data);
                    _event = new event();
                    _event._id = data.id;
                    if (data.subject) {
                        _event.subject = data.subject;
                    }
                    if (data.assignTo) {
                        _event.assignTo = data.assignTo;
                    }
                    if (data.description) {
                        _event.description = data.description;
                    }
                    if (data.start_date) {
                        _event.start_date = data.start_date;
                    }
                    if (data.end_date) {
                        _event.end_date = data.end_date;
                    }
                    if (data.status) {
                        _event.status = data.status;
                    }
                    if (data.eventType) {
                        _event.eventType = data.eventType;
                    }
                    ///////////////////////////////////////////////////
                    _event.save(function (err, result) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Events.js create savetoBd _event.save " + err);
                                res.send(500, { error: 'Events.save BD error' });
                            } else {
                                res.send(201, { success: 'A new event was created successfully' });
                            }
                        } catch (error) {
                            logWriter.log("Events.js create savetoBd _event.save " + error);
                        }
                    });
                } catch (error) {
                    console.log(error);
                    logWriter.log("Events.js create savetoBd " + error);
                    res.send(500, { error: 'Events.save  error' });
                }
            }
        } catch (exception) {
            console.log(exception);
            logWriter.log("Events.js  " + exception);
            res.send(500, { error: 'Events.save  error' });
        }
    }

    ;//End create

    function get(response) {
        var res = {}
        var description = "";
        res['data'] = [];
        var query = event.find();
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Events.js get Events.find' + description);
                response.send(500, { error: "Can't find Events" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    }; //end get

    function update(_id, data, res) {
        try {
            delete data._id;
            event.findById(_id, function (err, result) {
                if (err) {

                }
                else if (result) {
                    event.update({ _id: _id }, data, function (err, result) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Events.js update events.update " + err);
                                res.send(500, { error: "Can't update Events" });
                            } else {
                                res.send(200, { success: 'Events updated success' });
                            }
                        }
                        catch (exception) {
                            logWriter.log("Events.js getEvents event.find " + exception);
                        }
                    });
                } else if (!result) {
                    data.id = _id;
                    create(data, res);
                }
            });

        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Events.js update " + exception);
            res.send(500, { error: 'Events updated error' });
        }
    };// end update

    function remove(_id, res) {
        event.remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Events.js remove event.remove " + err);
                res.send(500, { error: "Can't remove Events" });
            } else {
                res.send(200, { success: 'Events removed' });
            }
        });
    };// end remove

    return {
        create: create,

        get: get,

        update: update,

        remove: remove,

        Events: Events
    };
};

module.exports = Events;