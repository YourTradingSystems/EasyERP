// JavaScript source code
var Events = function (logWriter, mongoose, googleModule) {
    var ObjectId = mongoose.Schema.Types.ObjectId,
        request = require('request');

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
        start: {},
        end: {},
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
        priority: { type: String, default: '' },
        isGoogle: { type: Boolean, default: false }
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
        link: { type: String, default: '' },
        events: { type: [ObjectId], ref: 'Events', default: null },
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
                    _event.start = data.start;
                }
            }
            if (data.end) {
                if (data.end.dateTime) {
                    _event.end = data.end;
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
                            if (success) {
                                res.send(201, { success: 'A new event was created successfully' });
                            } else {
                                console.log(err);
                                res.send(500, { error: 'Event.save DB error' });
                            }
                        });

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
            console.log(data.link);
            if (data.link) {
                _calendar.link = data.link;
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
                res['data'] = result.map(function (event) {
                    if(event.start && event.start.dateTime) event['start_date'] =  event.start.dateTime;
                    if (event.end && event.end.dateTime) event['end_date'] = event.end.dateTime;
                    if (event.start && event.start.date) event['start_date'] = event.start.date;
                    if (event.end && event.end.date) event['end_date'] = event.end.date;
                    return event;
                });
                response.send(res);
            }
        });
    }; //end get

    function update(id, data, res) {
        //console.log(data);
        try {
            delete data._id;
            event.find({ id: id }, function (err, result) {
                if (err) {

                }
                else if (result.length > 0) {

                    event.update({ id: id }, data, function (err, result) {
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
                    data.id = id;
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
        var query = (_id.length === 24) ? { _id: _id } : { id: _id };
        event.remove(query, function (err, result) {
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

        if (!data) {
            logWriter.log('Events.googleCalSync Incorrect Incoming Data');
            res.send(400, { error: 'Events.googleCalSync Incorrect Incoming Data' });
            return;
        } else {
			var countCal = 0;
            data.forEach(function (cal) {
				countCal++;
                var query = calendar.findOneAndUpdate({ id: cal.id }, cal, { upsert: true });
                query.exec(function (err, googleCalendar) {
                    if (googleCalendar) {
                        var curentCalendarId = googleCalendar._id;
						var countEv = 0;
                        cal.items.forEach(function (ev) {
							countEv++;
                            ev.calendarId = curentCalendarId;
                            ev.isGoogle = true;
                            var eventQuery = event.findOneAndUpdate({ id: ev.id }, ev, { upsert: true });
                            eventQuery.exec(function (err, googleEvent) {
                                if (googleEvent) {
                                    calendar.findOneAndUpdate({ id: cal.id }, { $addToSet: { events: googleEvent._id } }, function (error, upRes) {
                                        if (error) {
                                            console.log(error);
                                            logWriter.log("Events.js googleCalSync calendar.update " + error);
                                            res.send(500, { error: "Can't update Events" });
                                        } else {
											if(countCal==data.length&&countEv==cal.items.length){
												res.send(200);
											}
                                            console.log('>>>>>>>>>SetToupdateGoogleCallendar<<<<<<<<<<<<<');
                                            console.log(upRes);
                                        }
                                    });
                                    console.log('EventUpdatte or Create');
                                } else {
                                    console.log(err);
                                    logWriter.log("Events.js googleCalSync calendar.update " + err);
                                    res.send(500, { error: "Can't update Events" });
                                }
                            });
                        });
                    } else {
                        console.log(err);
                        logWriter.log("Events.js googleCalSync calendar.update " + err);
                        res.send(500, { error: "Can't update Calendar" });
                    }
                });
            });
        }
    };//end googleCalSync

    function getXML(res, link) {
        link = link.replace("basic", "full") + "?alt=json";
        request({ url: link, json: true }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var event = [];
                for (var i in body.feed.entry) {

                    var content = body.feed.entry[i].content.$t;
                    var startDate = new Date(body.feed.entry[i].gd$when[0].startTime).toISOString();
                    var endDate = new Date(body.feed.entry[i].gd$when[0].endTime).toISOString();
                    var subject = body.feed.entry[i].author[0].name.$t
                    event.push({ "id": body.feed.entry[i].id.$t.split("/")[6], "summary": body.feed.entry[i].title.$t, "description": content, start: { "dateTime": startDate }, end: { "dateTime": endDate }, "title": subject });
                }
                var calendar = { "id": body.feed.id.$t.split("/")[6], "summary": body.feed.title.$t, "description": body.feed.subtitle.$t, "summary": body.feed.title.$t, "link": link }
                calendar.items = event;
                data = [calendar]
                googleCalSync(data, res)
            }
        });
    }

    checkEventAsGoogle = function (id) {
        event.findByIdAndUpdate(id, { isGoogle: true }, function (err, ev) {
            if (err) {
                console.log("event check as google ", err)
            }

        })
    }
    
    function sendToGoogleCalendar(req, res) {
        var calendarsId = req.body.calendarsId;
        var query = event.find({ "isGoogle": false });
        var calendars = []
        calendarsId.forEach(function (id) {
            query.where({ "calendarId": id }).exec(function (err, events) {
                if (err) {
                    console.log(err);
                    logWriter.log("send to google " + err);

                } else {
                    calendar.findOne({ _id: id }).exec(function (err, result) {
                        calendars.push({ "id": result.id, "items": events });
                        if (calendars.length == calendarsId.length) {
                            googleModule.sendEventsToGoogle(req, res, calendars, checkEventAsGoogle);

                        }

                    });
                }
            });
        })
    }

    return {

        getXML: getXML,

        create: create,

        get: get,

        update: update,

        remove: remove,

        event: event,

        createCalendar: createCalendar,

        getCalendars: getCalendars,

        updateCalendar: updateCalendar,

        removeCalendar: removeCalendar,

        googleCalSync: googleCalSync,

        sendToGoogleCalendar: sendToGoogleCalendar
    };
};

module.exports = Events;
