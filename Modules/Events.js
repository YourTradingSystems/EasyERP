// JavaScript source code
var Events = function (logWriter, mongoose) {
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var eventsSchema = mongoose.Schema({
        calendarId: { type: ObjectId, ref: 'Calendars', default: null },
        id: { type: String, default: '' },
        kind: String,
        etag: String,
        htmlLink: String,
        created: Date,
        updated: Date,
        summary: { type: String, default: '' },
        creator: {
            email: String,
            displayName: String
        },
        organizer: {
            email: String,
            displayName: String,
            self: Boolean
        },
        start_date: Date,
        end_date: Date,
        iCalUID: String,
        sequence: Number,
        //attendees: [],
        reminders: { useDefault: Boolean },
        description: { type: String, default: '' },
        eventType: { type: String, default: '' },
        color: { type: String, default: '' },
        textColor: { type: String, default: '' },
        assignTo: { type: String, default: '' },
        status: { type: String, default: '' },
        priority: { type: String, default: '' }
    }, { collection: 'Events' });

    var calendarsSchema = mongoose.Schema({
        kind: String,
        etag: String,
        id: String,
        summary: { type: String, default: '' },
        timeZone: { type: String, default: '' },
        colorId: Number,
        backgroundColor: String,
        foregroundColor: String,
        selected: Boolean,
        accessRole: String,
        description: { type: String, default: '' },
        events: [{ type: ObjectId, ref: 'Events', default: null }],
        location: { type: String, default: '' }

    }, { collection: 'Calendars' });

    var event = mongoose.model('Events', eventsSchema);
    var calendar = mongoose.model('Calendars', calendarsSchema);

    function create(data, res) {
        try {
            if (!data) {
                logWriter.log('Events.create Incorrect Incoming Data');
                res.send(400, { error: 'Events.create Incorrect Incoming Data' });
                return;
            } else {
                saveEventToDb(data, res);
            }
            //function savetoDb(data) {
            //    try {
            //        _event = new event();
            //        if (data.summary) {
            //            _event.summary = data.summary;
            //        }
            //        if (data.calendarId) {
            //            _event.calendarId = data.calendarId;
            //        }
            //        if (data.priority) {
            //            _event.priority = data.priority;
            //        }
            //        if (data.assignTo) {
            //            _event.assignTo = data.assignTo;
            //        }
            //        if (data.description) {
            //            _event.description = data.description;
            //        }
            //        if (data.start) {
            //            _event.start = data.start;
            //        }
            //        if (data.end) {
            //            _event.end = data.end;
            //        }
            //        if (data.status) {
            //            _event.status = data.status;
            //        }
            //        if (data.eventType) {
            //            _event.eventType = data.eventType;
            //        }
            //        if (data.color) {
            //            _event.color = data.color;
            //        }
            //        if (data.textColor) {
            //            _event.textColor = data.textColor;
            //        }
            //        ///////////////////////////////////////////////////
            //        _event.save(function (err, result) {
            //            try {
            //                if (err) {
            //                    console.log(err);
            //                    logWriter.log("Events.js create savetoBd _event.save " + err);
            //                    res.send(500, { error: 'Events.save BD error' });
            //                } else {
            //                    res.send(201, { success: 'A new event was created successfully' });
            //                }
            //            } catch (error) {
            //                logWriter.log("Events.js create savetoBd _event.save " + error);
            //            }
            //        });
            //    } catch (error) {
            //        console.log(error);
            //        logWriter.log("Events.js create savetoBd " + error);
            //        res.send(500, { error: 'Events.save  error' });
            //    }
            //}
        } catch (exception) {
            console.log(exception);
            logWriter.log("Events.js  " + exception);
            res.send(500, { error: 'Events.save  error' });
        }
    };//End create

    function createCalendar(data, res) {
        try {
            if (!data) {
                logWriter.log('Events.createCalendar Incorrect Incoming Data');
                res.send(400, { error: 'Events.createCalendar Incorrect Incoming Data' });
                return;
            } else {
                saveCalendarToDb(data, res);
            }
            //function savetoDb(data) {
            //    try {
            //        _calendar = new calendar();
            //        if (data.kind) {
            //            _calendar.kind = data.kind;
            //        }
            //        if (data.etag) {
            //            _calendar.etag = data.etag;
            //        }
            //        if (data.id) {
            //            _calendar.id = data.id;
            //        }
            //        if (data.summary) {
            //            _calendar.summary = data.summary;
            //        }
            //        if (data.timeZone) {
            //            _calendar.timeZone = data.timeZone;
            //        }
            //        if (data.colorId) {
            //            _calendar.colorId = data.colorId;
            //        }
            //        if (data.backgroundColor) {
            //            _calendar.backgroundColor = data.backgroundColor;
            //        }
            //        if (data.foregroundColor) {
            //            _calendar.foregroundColor = data.foregroundColor;
            //        }
            //        if (data.selected) {
            //            _calendar.selected = data.selected;
            //        }
            //        if (data.accessRole) {
            //            _calendar.accessRole = data.accessRole;
            //        }
            //        if (data.description) {
            //            _calendar.description = data.description;
            //        }
            //        if (data.location) {
            //            _calendar.location = data.location;
            //        }
            //        ///////////////////////////////////////////////////
            //        _calendar.save(function (err, result) {
            //            try {
            //                if (err) {
            //                    console.log(err);
            //                    logWriter.log("Events.js createCalendar savetoBd _calendar.save " + err);
            //                    res.send(500, { error: 'calendar.save BD error' });
            //                } else {
            //                    res.send(201, { success: 'A new Calendar was created successfully' });
            //                }
            //            } catch (error) {
            //                logWriter.log("Events.js createCalendar savetoBd _calendar.save " + error);
            //            }
            //        });
            //    } catch (error) {
            //        console.log(error);
            //        logWriter.log("Events.js create savetoBd " + error);
            //        res.send(500, { error: 'Events.save  error' });
            //    }
            //}
        } catch (exception) {
            console.log(exception);
            logWriter.log("Events.js  " + exception);
            res.send(500, { error: 'Events.save  error' });
        }
    };//End createCalendar

    function saveEventToDb(data, res) {
        try {
            _event = new event();
            if (data.calendarId) {
                _event.calendarId = data.calendarId;
            }
            if (data.id) {
                _event.id = data.id;
            }
            if (data.etag) {
                _event.etag = data.etag;
            }
            if (data.htmlLink) {
                _event.htmlLink = data.htmlLink;
            }
            if (data.created) {
                _event.created = data.created;
            }
            if (data.updated) {
                _event.updated = data.updated;
            }
            if (data.summary) {
                _event.summary = data.summary;
            }
            if (data.creator) {
                if (data.creator.email) {
                    _event.creator.email = data.creator.email
                }
                if (data.creator.displayName) {
                    _event.creator.displayName = data.creator.displayName
                }
            }
            if (data.organizer) {
                if (data.organizer.email) {
                    _event.organizer.email = data.organizer.email
                }
                if (data.organizer.displayName) {
                    _event.organizer.displayName = data.organizer.displayName;
                }
                if (data.organizer.self) {
                    _event.organizer.self = data.organizer.self;
                }
            }
            if (data.start) {
                if (data.start.dateTime) {
                    _event.start_date = data.start.dateTime;
                }
            }          
            if (data.end) {
                if (data.end.dateTime) {
                    _event.end_date = data.end.dateTime;
                }
            }
            if (data.start_date) {
                _event.start_date = data.start_date;
            }
            if (data.end_date) {
                _event.end_date = data.end_date;
            }
            if (data.iCalUID) {
                _event.iCalUID = data.iCalUID;
            }
            if (data.sequence) {
                _event.sequence = data.sequence;
            }
            //if (data.attendees) {
            //    _event.attendees = data.attendees;
            //}
            if (data.reminders) {
                if (data.reminders.useDefault) {
                    _event.reminders.useDefault = data.reminders.useDefault;
                }
            }
            if (data.priority) {
                _event.priority = data.priority;
            }
            if (data.assignTo) {
                _event.assignTo = data.assignTo;
            }
            if (data.description) {
                _event.description = data.description;
            }
            if (data.status) {
                _event.status = data.status;
            }
            if (data.eventType) {
                _event.eventType = data.eventType;
            }
            if (data.color) {
                _event.color = data.color;
            }
            if (data.textColor) {
                _event.textColor = data.textColor;
            }
            ///////////////////////////////////////////////////
            _event.save(function (err, result) {
                try {
                    if (err) {
                        console.log(err);
                        logWriter.log("Events.js create savetoBd _event.save " + err);
                        res.send(500, { error: 'Events.save BD error' });
                    } else {
                        calendar.findByIdAndUpdate(data.calendarId, { $push: { events: result._id } }, function (err, success) {
                            if (err) {
                                console.log(err);
                                res.send(500, { error: 'Event.save DB error' });
                            }
                        });
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
    };//End Saving Event To Db

    function saveCalendarToDb(data, res) {
        try {
            _calendar = new calendar();
            if (data.id) {
                _calendar.id = data.id;
            }
            if (data.summary) {
                _calendar.summary = data.summary;
            }
            if (data.description) {
                _calendar.description = data.description;
            }
            if (data.kind) {
                _calendar.kind = data.kind;
            }
            if (data.etag) {
                _calendar.etag = data.etag;
            }
            if (data.location) {
                _calendar.location = data.location;
            }
            if (data.timeZone) {
                _calendar.timeZone = data.timeZone;
            }
            _calendar.save(function (err, result) {
                console.log(result);
                try {
                    if (err) {
                        console.log(err);
                        logWriter.log("Events.js googleCalSync savetoBd _calendar.save " + err);
                        res.send(500, { error: 'calendar.save BD error' });
                    } else {
                        if (data.items) {
                            var i = 0;
                            data.items.forEach(function (ev) {
                                try {
                                    if (!ev || !ev.id) {
                                        logWriter.log('Events.googleCalSync Incorrect Incoming Data');
                                        res.send(400, { error: 'Events.create Incorrect Incoming Data' });
                                        return;
                                    } else {
                                        ev.calendarId = result._id;
                                        saveEventToDb(ev, res);
                                    }

                                } catch (exception) {
                                    console.log(exception);
                                    logWriter.log("Events.js  " + exception);
                                    res.send(500, { error: 'Events.save  error' });
                                }
                            });
                        }
                        res.send(201, { success: 'A new сalendar was created successfully' });
                    }
                } catch (error) {
                    logWriter.log("Events.js createCalendar savetoBd _calendar.save " + error);
                }
            });
        } catch (error) {
            console.log(error);
            logWriter.log("Events.js create savetoBd " + error);
            res.send(500, { error: 'Events.save  error' });
        }
    };//Saving Calendar to Db With Checking it's events

    function getCalendars(response) {
        var res = {}
        var description = "";
        res['data'] = [];
        var query = calendar.find();
        query.sort({ summary: 1 });
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Events.js getCalendar calendar.find' + description);
                response.send(500, { error: "Can't find Calendars" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    }; //end getCalendar

    function updateCalendar(_id, data, res) {
        try {
            delete data._id;
            calendar.findById(_id, function (err, result) {
                if (err) {

                }
                else if (result) {
                    calendar.update({ id: _id }, data, function (err, result) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Events.js updateCalendar calendar.update " + err);
                                res.send(500, { error: "Can't updateCalendar Calendar" });
                            } else {
                                res.send(200, { success: 'Calendars updated success' });
                            }
                        }
                        catch (exception) {
                            logWriter.log("Events.js getCalendar calendar.find " + exception);
                        }
                    });
                } else if (!result) {
                    //data._id = _id;
                    createCalendar(data, res);
                }
            });

        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Events.js updateCalendar " + exception);
            res.send(500, { error: 'Events updatedCalndar error' });
        }
    };// end updateCalendar

    function removeCalendar(_id, res) {
        calendar.remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Events.js remove event.removeCalendar " + err);
                res.send(500, { error: "Can't remove Calendar" });
            } else {
                res.send(200, { success: 'Calendar removed' });
            }
        });
    };// end removeCalendar

    function get(response) {
        var res = {}
        var description = "";
        res['data'] = [];
        var query = event.find();
        query.populate('calendarId');
        query.sort({ summary: 1 });
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
        console.log('Excellent');
        try {
           // delete data._id;
            event.find({ id: _id }, function (err, result) {
                console.log(result);
                if (err) {

                }
                else if (result.length > 0) {
                  
                    event.update({ id: _id }, data, function (err, result) {
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
                } else {
                    console.log('**********************');
                    console.log(data);
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

    function googleCalSync(data, res) {
        try {
            if (!data) {
                logWriter.log('Events.googleCalSync Incorrect Incoming Data');
                res.send(400, { error: 'Events.googleCalSync Incorrect Incoming Data' });
                return;
            } else {
                data.forEach(function (cal) {
                    calendar.find({ id: cal.id }, function (err, result) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Events.js googleCalSync calendar.find " + err);
                            res.send(500, { error: "Can't googleCalSync Events" });
                        }
                        else if (result.length > 0) {
                            //Updating an Existing Calendar in DataBase
                            var curentCalendarId = result._id;
                            calendar.update({ _id: result._id }, cal, function (err, result) {
                                try {
                                    if (err) {
                                        console.log(err);
                                        logWriter.log("Events.js googleCalSync calendar.update " + err);
                                        res.send(500, { error: "Can't update Calendar" });
                                    } else {
                                        if (items) {
                                            //Update Existing Calendar Events
                                            cal.items.forEach(function (ev) {
                                                event.find({ id: ev.id }, function (err, result) {
                                                    if (err) {
                                                        console.log(err);
                                                        logWriter.log("Events.js googleCalSync event.find " + err);
                                                        res.send(500, { error: "Can't find Event" });
                                                    }
                                                    else if (result) {
                                                        // If Event exists update it 
                                                        event.update({ _id: result._id }, ev, function (err, result) {
                                                            try {
                                                                if (err) {
                                                                    console.log(err);
                                                                    logWriter.log("Events.js googleCalSync events.update " + err);
                                                                    res.send(500, { error: "Can't googleCalSync Events" });
                                                                } else {
                                                                    res.send(200, { success: 'Events updated success' });
                                                                }
                                                            }
                                                            catch (exception) {
                                                                logWriter.log("Events.js getEvents event.find " + exception);
                                                            }
                                                        });
                                                    } else {
                                                        // Create new Event
                                                        try {
                                                            if (!ev || !ev.id) {
                                                                logWriter.log('Events.create Incorrect Incoming Data');
                                                                res.send(400, { error: 'Events.create Incorrect Incoming Data' });
                                                                return;
                                                            } else {
                                                                ev.calendarId = curentCalendarId;
                                                                saveEventToDb(ev);
                                                            }
                                                        } catch (exception) {
                                                            console.log(exception);
                                                            logWriter.log("Events.js  " + exception);
                                                            res.send(500, { error: 'Events.save  error' });
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                        res.send(200, { success: 'Calendar updated success' });
                                    }
                                }
                                catch (exception) {
                                    logWriter.log("Events.js googleCalSync calendar.update " + exception);
                                }
                            });
                        } else {
                            //Creating a new Calendar in DataBase
                            try {
                                if (!cal) {
                                    logWriter.log('Events.googleCalSync Incorrect Incoming Data');
                                    res.send(400, { error: 'Events.googleCalSync Incorrect Incoming Data' });
                                    return;
                                } else {
                                    saveCalendarToDb(cal, res);
                                }
                            } catch (exception) {
                                console.log(exception);
                                logWriter.log("Events.js  " + exception);
                                res.send(500, { error: 'Events.save  error' });
                            }
                        }
                    });
                });
            }
        } catch (exception) {
            console.log(exception);
            logWriter.log("Events.js  " + exception);
            res.send(500, { error: 'Events.save  error' });
        }
    };//end googleCalSync


    return {
        create: create,

        get: get,

        update: update,

        remove: remove,

        event: event,

        createCalendar: createCalendar,

        getCalendars: getCalendars,

        updateCalendar: updateCalendar,

        removeCalendar: removeCalendar,

        googleCalSync: googleCalSync
    };
};

module.exports = Events;