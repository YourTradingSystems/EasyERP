var Leads = function (logWriter, mongoose) {

    var leadsSchema = mongoose.Schema({
        name: { type: String, default: 'New Lead' },
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
            //street2: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        salesPerson: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        salesTeam: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        contactName: {
            first: { type: String, default: '' },
            last: { type: String, default: '' }
        },
        email: { type: String, default: '' },
        func: { type: String, default: '' },
        phones: {
            mobile: { type: String, default: '' },
            phone: { type: String, default: '' }
        },
        fax: { type: String, default: '' },
        workflow: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        priority: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        categories: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        active: { type: Boolean, default: true },
        optout: { type: Boolean, default: false },
        reffered: { type: String, default: '' },
        internalNotes: { type: String, default: '' }
    }, { collection: 'Leads' });

    var lead = mongoose.model('Leads', leadsSchema);

    function create(data, res) {
        try {
            if (typeof (data) == 'undefined') {
                logWriter.log('Leads.create Incorrect Incoming Data');
                res.send(400, { error: 'Leads.create Incorrect Incoming Data' });
                return;
            } else {
                var query = { name: data.name };
                lead.find(query, function (error, doc) {
                    if (error) {
                        console.log(error);
                        logWriter.log('Leads.js. create lead.find' + error);
                        res.send(500, { error: 'Leads.create find error' });
                    }
                    if (doc.length > 0) {
                        if (doc[0].name === data.name) {
                            res.send(400, { error: 'An Leads with the same Name already exists' });
                        }
                    } else if (doc.length === 0) {
                        savetoDB(data);
                    }
                });
            }
            function savetoDB(data) {
                try {
                    _lead = new lead();
                    if ((typeof (data.name) != 'undefined') && (data.name != null)) {
                        _lead.name = data.name;
                    }
                    if ((typeof (data.company) != 'undefined') && (data.customer != null)) {
                        if (typeof (data.company.id) != 'undefined') {
                            _lead.company.id = data.company.id;
                        }
                        if (typeof (data.company.name) != 'undefined') {
                            _lead.company.name = data.company.name;
                        }
                    }
                    if ((typeof (data.customer) != 'undefined') && (data.customer != null)) {
                        if (typeof (data.customer.id) != 'undefined') {
                            _lead.customer.id = data.customer.id;
                        }
                        if (typeof (data.customer.name) != 'undefined') {
                            _lead.customer.name = data.customer.name;
                        }
                    }
                    if ((typeof (data.address) != 'undefined') && (data.address != null)) {
                        if (typeof (data.address.street) != 'undefined') {
                            _lead.address.street = data.address.street;
                        }
                        if (typeof (data.address.city) != 'undefined') {
                            _lead.address.city = data.address.city;
                        }
                        if (typeof (data.address.state) != 'undefined') {
                            _lead.address.state = data.address.state;
                        }
                        if (typeof (data.address.zip) != 'undefined') {
                            _lead.address.zip = data.address.zip;
                        }
                        if (typeof (data.address.country) != 'undefined') {
                            _lead.address.country = data.address.country;
                        }
                    }
                    if ((typeof (data.salesPerson) != 'undefined') && (data.salesPerson != null)) {
                        if (typeof (data.salesPerson.id) != 'undefined') {
                            _lead.salesPerson.id = data.salesPerson.id;
                        }
                        if (typeof (data.salesPerson.name) != 'undefined') {
                            _lead.salesPerson.name = data.salesPerson.name;
                        }
                    }
                    if ((typeof (data.salesTeam) != 'undefined') && (data.salesTeam != null)) {
                        if (typeof (data.salesTeam.id) != 'undefined') {
                            _lead.salesTeam.id = data.salesTeam.id;
                        }
                        if (typeof (data.salesTeam.name) != 'undefined') {
                            _lead.salesTeam.name = data.salesTeam.name;
                        }
                    }
                    if ((typeof (data.contactName) != 'undefined') && (data.contactName != null)) {
                        if (typeof (data.contactName.first) != 'undefined') {
                            _lead.contactName.first = data.contactName.first;
                        }
                        if (typeof (data.contactName.last) != 'undefined') {
                            _lead.contactName.last = data.contactName.last;
                        }
                    }
                    if (typeof (data.email) != 'undefined') {
                        _lead.email = data.email;
                    }
                    if (typeof (data.func) != 'undefined') {
                        _lead.func = data.func;
                    }
                    if ((typeof (data.phones) != 'undefined') && (data.phones != null)) {
                        if (typeof (data.phones.phone) != 'undefined') {
                            _lead.phones.phone = data.phones.phone;
                        }
                        if (typeof (data.phones.mobile) != 'undefined') {
                            _lead.phones.mobile = data.phones.mobile;
                        }
                    }
                    if (typeof (data.fax) != 'undefined') {
                        _lead.fax = data.fax;
                    }
                    if ((typeof (data.workflow) != 'undefined') && (data.workflow != null)) {
                        if (typeof (data.workflow.id) != 'undefined') {
                            _lead.workflow.id = data.workflow.id;
                        }
                        if (typeof (data.workflow.name) != 'undefined') {
                            _lead.workflow.name = data.workflow.name;
                        }
                    }
                    if ((typeof (data.priority) != 'undefined') && (data.priority != null)) {
                        if (typeof (data.priority.id) != 'undefined') {
                            _lead.priority.id = data.priority.id;
                        }
                        if (typeof (data.priority.name) != 'undefined') {
                            _lead.priority.name = data.priority.name;
                        }
                    }
                    if ((typeof (data.categories) != 'undefined') && (data.categories != null)) {
                        if (typeof (data.categories.id) != 'undefined') {
                            _lead.categories.id = data.categories.id;
                        }
                        if (typeof (data.categories.name) != 'undefined') {
                            _lead.categories.name = data.categories.name;
                        }
                    }
                    if (typeof (data.active) != 'undefined') {
                        _lead.active = data.active;
                    }
                    if (typeof (data.optout) != 'undefined') {
                        _lead.optout = data.optout;
                    }
                    if (typeof (data.reffered) != 'undefined') {
                        _lead.reffered = data.reffered;
                    }
                    if (typeof (data.internalNotes) != 'undefined') {
                        _lead.internalNotes = data.internalNotes;
                    }
                    _lead.save(function (err, _leadd) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Leads.js create savetoDB _lead.save " + err);
                            res.send(500, { error: 'Leads.save BD error' });
                        } else {
                            res.send(201, { success: 'A new lead create success' });
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    logWriter.log("Leads.js create savetoDB " + error);
                    res.send(500, { error: 'Leads.save  error' });
                }
            }
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Leads.js  " + Exception);
            res.send(500, { error: 'lead.save  error' });
        }
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        lead.find({}, function (err, _lead) {
            if (err) {
                console.log(err);
                logWriter.log('Leads.js get lead.find' + err);
                response.send(500, { error: "Can't find Leads" });
            } else {
                res['data'] = _lead;
                console.log(res);
                response.send(res);
            }
        });
    };

    function update(_id, data, res) {
        try {
            delete data._id;
            lead.update({ _id: _id }, data, function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("Leads.js update lead.update " + err);
                    res.send(500, { error: "Can't update Leads" });
                } else {
                    res.send(200, { success: 'Leads updated success' });
                }
            });
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Leads.js update " + Exception);
            res.send(500, { error: 'Leads updated error' });
        }
    };// end update

    function remove(_id, res) {
        lead.remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Leads.js remove lead.remove " + err);
                res.send(500, { error: "Can't remove Leads" });
            } else {
                res.send(200, { success: 'Leads removed' });
            }
        });
    };// end remove

    return {
        create: create,

        get: get,

        update: update,

        remove: remove,

        lead: lead
    };

};
module.exports = Leads;