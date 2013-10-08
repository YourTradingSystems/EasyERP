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
                    if (data.name) {
                        _lead.name = data.name;
                    }
                    if (data.company) {
                        if (data.company.id) {
                            _lead.company.id = data.company.id;
                        }
                        if (data.company.name) {
                            _lead.company.name = data.company.name;
                        }
                    }
                    if (data.customer) {
                        if (data.customer.id) {
                            _lead.customer.id = data.customer.id;
                        }
                        if (data.customer.name) {
                            _lead.customer.name = data.customer.name;
                        }
                    }
                    if(data.address) {
                        if (data.address.street) {
                            _lead.address.street = data.address.street;
                        }
                        if (data.address.city) {
                            _lead.address.city = data.address.city;
                        }
                        if (data.address.state) {
                            _lead.address.state = data.address.state;
                        }
                        if (data.address.zip) {
                            _lead.address.zip = data.address.zip;
                        }
                        if (data.address.country) {
                            _lead.address.country = data.address.country;
                        }
                    }
                    if (data.salesPerson) {
                        if (data.salesPerson.id) {
                            _lead.salesPerson.id = data.salesPerson.id;
                        }
                        if (data.salesPerson.name) {
                            _lead.salesPerson.name = data.salesPerson.name;
                        }
                    }
                    if (data.salesTeam) {
                        if (data.salesTeam.id) {
                            _lead.salesTeam.id = data.salesTeam.id;
                        }
                        if (data.salesTeam.name) {
                            _lead.salesTeam.name = data.salesTeam.name;
                        }
                    }
                    if (data.contactName) {
                        if (data.contactName.first) {
                            _lead.contactName.first = data.contactName.first;
                        }
                        if (data.contactName.last) {
                            _lead.contactName.last = data.contactName.last;
                        }
                    }
                    if (data.email) {
                        _lead.email = data.email;
                    }
                    if (data.func) {
                        _lead.func = data.func;
                    }
                    if (data.phones) {
                        if (data.phones.phone) {
                            _lead.phones.phone = data.phones.phone;
                        }
                        if (data.phones.mobile) {
                            _lead.phones.mobile = data.phones.mobile;
                        }
                    }
                    if (data.fax) {
                        _lead.fax = data.fax;
                    }
                    if (data.workflow) {
                        if (data.workflow.id) {
                            _lead.workflow.id = data.workflow.id;
                        }
                        if (data.workflow.name) {
                            _lead.workflow.name = data.workflow.name;
                        }
                    }
                    if (data.priority) {
                        if (data.priority.id) {
                            _lead.priority.id = data.priority.id;
                        }
                        if (data.priority.name) {
                            _lead.priority.name = data.priority.name;
                        }
                    }
                    if (data.categories) {
                        if (data.categories.id) {
                            _lead.categories.id = data.categories.id;
                        }
                        if (data.categories.name) {
                            _lead.categories.name = data.categories.name;
                        }
                    }
                    if (data.active) {
                        _lead.active = data.active;
                    }
                    if (data.optout) {
                        _lead.optout = data.optout;
                    }
                    if (data.reffered) {
                        _lead.reffered = data.reffered;
                    }
                    if (data.internalNotes) {
                        _lead.internalNotes = data.internalNotes;
                    }
                    _lead.save(function (err, result) {
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