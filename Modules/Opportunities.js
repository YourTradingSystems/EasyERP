var Opportunities = function (logWriter, mongoose) {

    var opportunitiesSchema = mongoose.Schema({
        isOpportunitie: { type: Boolean, default: false },
        name: { type: String, default: '' },
        expectedRevenue: {
            value: { type: Number, default: '' },
            progress: { type: Number, default: '' },
            currency: { type: String, default: '' }
        },
        creationDate: { type: Date, default: Date.now },
        company: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        customer: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        address: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        contactName: {
            first: { type: String, default: '' },
            last: { type: String, default: '' }
        },
        email: { type: String, default: '' },
        phones: {
            mobile: { type: String, default: '' },
            phone: { type: String, default: '' },
            fax: { type: String, default: '' }
        },
        func: { type: String, default: '' },
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
        priority: { type: String, default: 'Trivial' },
        categories: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        color: { type: String, default: '#4d5a75' },
        active: { type: Boolean, default: true },
        optOut: { type: Boolean, default: false },
        reffered: { type: String, default: '' },
        workflow: {
            status: { type: String, default: '' },
            name: { type: String, default: '' }
        }
    }, { collection: 'Opportunities' });

    var opportunitie = mongoose.model('Opportunities', opportunitiesSchema);

    function create(data, res) {
        try {
            if (!data) {
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
                        savetoDb(data);
                    }
                });
            }
            function savetoDb(data) {
                try {
                    _opportunitie = new opportunitie();
                    _opportunitie.isOpportunitie = (data.isOpportunitie) ? data.isOpportunitie : false;
                    if (data.name) {
                        _opportunitie.name = data.name;
                    }
                    if (data.color) {
                        _opportunitie.color = data.color;
                    }
                    if (data.expectedRevenue) {
                        if (data.expectedRevenue.value) {
                            _opportunitie.expectedRevenue.value = data.expectedRevenue.value;
                        }
                        if (data.expectedRevenue.progress) {
                            _opportunitie.expectedRevenue.progress = data.expectedRevenue.progress;
                        }
                        if (data.expectedRevenue.currency) {
                            _opportunitie.expectedRevenue.currency = data.expectedRevenue.currency;
                        }
                    }
                    if (data.creationDate) {
                        _opportunitie.creationDate = data.creationDate;
                    }
                    if (data.company) {
                        if (data.company._id) {
                            _opportunitie.company.id = data.company._id;
                        }
                        if (data.company.name) {
                            _opportunitie.company.name = data.company.name;
                        }
                    }
                    if (data.customer) {
                        if (data.customer._id) {
                            _opportunitie.customer.id = data.customer._id;
                        }
                        if (data.customer.name) {
                            _opportunitie.customer.name = data.customer.name.first + " " + data.customer.name.last;
                        }
                    }
                    if (data.address) {
                        if (data.address.street) {
                            _opportunitie.address.street = data.address.street;
                        }
                        if (data.address.city) {
                            _opportunitie.address.city = data.address.city;
                        }
                        if (data.address.state) {
                            _opportunitie.address.state = data.address.state;
                        }
                        if (data.address.zip) {
                            _opportunitie.address.zip = data.address.zip;
                        }
                        if (data.address.country) {
                            _opportunitie.address.country = data.address.country;
                        }
                    }
                    if (data.contactName) {
                        if (data.contactName.first) {
                            _opportunitie.contactName.first = data.contactName.first;
                        }
                        if (data.contactName.last) {
                            _opportunitie.contactName.last = data.contactName.last;
                        }
                    }
                    if (data.email) {
                        _opportunitie.email = data.email;
                    }
                    if (data.phones) {
                        if (data.phones.phone) {
                            _opportunitie.phones.phone = data.phones.phone;
                        }
                        if (data.phones.mobile) {
                            _opportunitie.phones.mobile = data.phones.mobile;
                        }
                        if (data.fax) {
                            _opportunitie.phones.fax = data.phones.fax;
                        }
                    }
                    if (data.func) {
                        _opportunitie.func = data.func;
                    }
                    if (data.salesPerson) {
                        if (data.salesPerson._id) {
                            _opportunitie.salesPerson.id = data.salesPerson._id;
                        }
                        if (data.salesPerson.name) {
                            _opportunitie.salesPerson.name = data.salesPerson.name.first + ' ' + data.salesPerson.name.last;
                        }
                    }
                    if (data.salesTeam) {
                        if (data.salesTeam._id) {
                            _opportunitie.salesTeam.id = data.salesTeam._id;
                        }
                        if (data.salesTeam.departmentName) {
                            _opportunitie.salesTeam.name = data.salesTeam.departmentName;
                        }
                    }
                    if (data.internalNotes) {
                        _opportunitie.internalNotes = data.internalNotes;
                    }
                    if (data.nextAction) {
                        if (data.nextAction.desc) {
                            _opportunitie.nextAction.desc = data.nextAction.desc;
                        }
                        if (data.nextAction.date) {
                            _opportunitie.nextAction.date = data.nextAction.date;
                        }
                    }
                    if (data.expectedClosing) {
                        _opportunitie.expectedClosing = data.expectedClosing;
                    }
                    if (data.priority) {
                        if (data.priority) {
                            _opportunitie.priority = data.priority;
                        }
                    }
                    if (data.categories) {
                        if (data.categories._id) {
                            _opportunitie.categories.id = data.categories._id;
                        }
                        if (data.categories.name) {
                            _opportunitie.categories.name = data.categories.name;
                        }
                    }
                    if (data.workflow) {
                        if (data.workflow.name) {
                            _opportunitie.workflow.name = data.workflow.name;
                        }
                        if (data.workflow.status) {
                            _opportunitie.workflow.status = data.workflow.status;
                        }
                    }
                    if (data.active) {
                        _opportunitie.active = data.active;
                    }
                    if (data.optOut) {
                        _opportunitie.optOut = data.optOut;
                    }
                    if (data.reffered) {
                        _opportunitie.reffered = data.reffered;
                    }
                    _opportunitie.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Opportunities.js create savetoDB _opportunitie.save " + err);
                            res.send(500, { error: 'Opportunities.save BD error' });
                        } else {
                            res.send(201, { success: 'A new Opportunities create success' });
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
        catch (exception) {
            console.log(exception);
            logWriter.log("Opportunities.js  " + exception);
            res.send(500, { error: 'opportunitie.save  error' });
        }
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        var query = opportunitie.find({isOpportunitie: true});
        query.sort({ name: 1 });
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Opportunities.js get job.find' + err);
                response.send(500, { error: "Can't find Opportunities" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function getLeads(response) {
        var res = {};
        res['data'] = [];
        var query = opportunitie.find({ isOpportunitie: false });
        query.sort({ name: 1 });
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Leads.js get lead.find' + err);
                response.send(500, { error: "Can't find Leads" });
            } else {
                res['data'] = result;
                console.log(res);
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
        catch (exception) {
            console.log(exception);
            logWriter.log("Opportunities.js update " + exception);
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

        getLeads: getLeads,

        update: update,

        remove: remove
    }
};
module.exports = Opportunities;

