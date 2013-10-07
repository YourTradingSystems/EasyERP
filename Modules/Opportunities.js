var Opportunities = function (logWriter, mongoose) {

    var opportunitiesSchema = mongoose.Schema({
        name: { type: String, default: '' },
        expectedRevenue: {
            value: { type: Number, default: '' },
            progress: { type: Number, default: '' },
            currency: { type: String, default: '' }
        },
        creationDate: { type: Date, default: Date.now },
        customer: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        salesPerson: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        salesTeam: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        internalNotes: { type: String, default: '' },
        nextAction: {
            desc: { type: String, default: '' },
            date: { type: Date, default: null }
        },
        expectedClosing: { type: Date, default: null },
        priority: {
            priority: { type: String, default: 'Normal' }
        },
        categories: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        workflow: {
            status: { type: String, default: '' },
            name: { type: String, default: '' }
        }
    }, { collection: 'Opportunities' });

    var opportunitie = mongoose.model('Opportunities', opportunitiesSchema);

    function create(data, res) {
        try {
            if (typeof (data) == 'undefined') {
                logWriter.log('Opprtunities.create Incorrect Incoming Data');
                res.send(400, { error: 'Opprtunities.create Incorrect Incoming Data' });
                return;
            } else {
                var query = { name: data.name };
                opportunitie.find(query, function (error, doc) {
                    if (error) {
                        console.log(error);
                        logWriter.log('Opprtunities.js. create opportunitie.find' + error);
                        res.send(500, { error: 'Opprtunities.create find error' });
                    }
                    if (doc.length > 0) {
                        if (doc[0].name === data.name) {
                            res.send(400, { error: 'An Opprtunities with the same Name already exists' });
                        }
                    } else if (doc.length === 0) {
                        savetoDB(data);
                    }
                });
            }
            function savetoDB(data) {
                try {
                    _opportunitie = new opportunitie();
                    if ((typeof (data.name) != 'undefined') && (data.name != null)) {
                        _opportunitie.name = data.name;
                    }
                    if ((typeof (data.expectedRevenue) != 'undefined') && (data.expectedRevenue != null)) {
                        if (typeof (data.expectedRevenue.value) != 'undefined') {
                            _opportunitie.expectedRevenue.value = data.expectedRevenue.value;
                        }
                        if (typeof (data.expectedRevenue.progress) != 'undefined') {
                            _opportunitie.expectedRevenue.progress = data.expectedRevenue.progress;
                        }
                        if (typeof (data.expectedRevenue.currency) != 'undefined') {
                            _opportunitie.expectedRevenue.currency = data.expectedRevenue.currency;
                        }
                    }
                    if ((typeof (data.creationDate) != 'undefined') && (data.creationDate != null)) {
                        _opportunitie.creationDate = data.creationDate;
                    }
                    if ((typeof (data.customer) != 'undefined') && (data.customer != null)) {
                        if (typeof (data.customer.id) != 'undefined') {
                            _opportunitie.customer.id = data.customer.id;
                        }
                        if (typeof (data.customer.name) != 'undefined') {
                            _opportunitie.customer.name = data.customer.name;
                        }
                    }
                    if (typeof (data.email) != 'undefined') {
                        _opportunitie.email = data.email;
                    }
                    if (typeof (data.phone) != 'undefined') {
                        _opportunitie.phone = data.phone;
                    }
                    if ((typeof (data.salesPerson) != 'undefined') && (data.salesPerson != null)) {
                        if (typeof (data.salesPerson.id) != 'undefined') {
                            _opportunitie.salesPerson.id = data.salesPerson.id;
                        }
                        if (typeof (data.customer.name) != 'undefined') {
                            _opportunitie.salesPerson.name = data.salesPerson.name;
                        }
                    }
                    if ((typeof (data.salesTeam) != 'undefined') && (data.salesTeam != null)) {
                        if (typeof (data.salesTeam.id) != 'undefined') {
                            _opportunitie.salesTeam.id = data.salesTeam.id;
                        }
                        if (typeof (data.salesTeam.name) != 'undefined') {
                            _opportunitie.salesTeam.name = data.salesTeam.name;
                        }
                    }
                    if (typeof (data.internalNotes) != 'undefined') {
                        _opportunitie.internalNotes = data.internalNotes;
                    }
                    if ((typeof (data.nextAction) != 'undefined') && (data.nextAction != null)) {
                        if (typeof (data.nextAction.desc) != 'undefined') {
                            _opportunitie.nextAction.desc = data.nextAction.desc;
                        }
                        if (typeof (data.nextAction.date) != 'undefined') {
                            _opportunitie.nextAction.date = data.nextAction.date;
                        }
                    }
                    if (typeof (data.expectedClosing) != 'undefined') {
                        _opportunitie.expectedClosing = data.expectedClosing;
                    }
                    if ((typeof (data.priority) != 'undefined') && (data.priority != null)) {
                        if (typeof (data.priority.priority) != 'undefined') {
                            _opportunitie.priority.priority = data.priority.priority;
                        }
                    }
                    if ((typeof (data.categories) != 'undefined') && (data.categories != null)) {
                        if (typeof (data.categories.id) != 'undefined') {
                            _opportunitie.categories.id = data.categories.id;
                        }
                        if (typeof (data.categories.name) != 'undefined') {
                            _opportunitie.categories.name = data.categories.name;
                        }
                    }
                    if ((typeof (data.workflow) != 'undefined') && (data.workflow != null)) {
                        if (typeof (data.workflow.name) != 'undefined') {
                            _opportunitie.workflow.name = data.workflow.name;
                        }
                        if (typeof (data.workflow.status) != 'undefined') {
                            _opportunitie.workflow.status = data.workflow.status;
                        }
                    }
                    _opportunitie.save(function (err, opportun) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Opportunities.js create savetoDB _opportunitie.save " + err);
                            res.send(500, { error: 'Opportunities.save BD error' });
                        } else {
                            res.send(201, { success: 'A new Opportunities crate success' });
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    logWriter.log("Opportunities.js create savetoDB " + error);
                    res.send(500, { error: 'Opportunities.save  error' });
                }
            }
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Opportunities.js  " + Exception);
            res.send(500, { error: 'opportunitie.save  error' });
        }
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        opportunitie.find({}, function (err, Opportunitie) {
            if (err) {
                console.log(err);
                logWriter.log('Opportunities.js get job.find' + err);
                response.send(500, { error: "Can't find Opportunities" });
            } else {
                res['data'] = Opportunitie;
                response.send(res);
            }
        });
    };

    function update(_id, data, res) {
        try {
            delete data._id;
            opportunitie.update({ _id: _id }, data, function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("Opportunities.js update opportunitie.update " + err);
                    res.send(500, { error: "Can't update Opportunities" });
                } else {
                    res.send(200, { success: 'Opportunities updated success' });
                }
            });
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Opportunities.js update " + Exception);
            res.send(500, { error: 'Opportunities updated error' });
        }
    };// end update

    function remove(_id, res) {
        opportunitie.remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Opportunities.js remove opportunitie.remove " + err);
                res.send(500, { error: "Can't remove Opportunities" });
            } else {
                res.send(200, { success: 'Opportunities removed' });
            }
        });
    };// end remove

    return {
        create: create,

        get: get,

        update: update,

        remove: remove
    }
};
module.exports = Opportunities;

