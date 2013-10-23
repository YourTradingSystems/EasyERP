var Leads = function (logWriter, mongoose) {

    var leadsSchema = mongoose.Schema({
        isOpportunitie: {type: Boolean, default: false},
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
            phone: { type: String, default: '' },
            fax: { type: String, default: '' }
        },
        workflow: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        priority: { type: String, default: 'Trivial' },
        categories: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        active: { type: Boolean, default: true },
        optOut: { type: Boolean, default: false },
        reffered: { type: String, default: '' },
        internalNotes: { type: String, default: '' }
    }, { collection: 'Leads' });
    
    var lead = mongoose.model('Leads', leadsSchema);
    
    function create(data, res) {
        try {
            if (!data) {
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
                        savetoDb(data);
                    }
                });
            }
            function savetoDb(data) {
                try {
                    _lead = new lead();
                    if (data.name) {
                        _lead.name = data.name;
                    }
                    if (data.company) {
                        if (data.company._id) {
                            _lead.company.id = data.company._id;
                        }
                        if (data.company.name) {
                            _lead.company.name = data.company.name;
                        }
                    }
                    if (data.customer) {
                        if (data.customer._id) {
                            _lead.customer.id = data.customer._id;
                        }
                        if (data.customer.name) {
                            _lead.customer.name = data.customer.name;
                        }
                    }
                    if (data.address) {
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
                        if (data.salesPerson._id) {
                            _lead.salesPerson.id = data.salesPerson._id;
                        }
                        if (data.salesPerson.name) {
                            _lead.salesPerson.name = data.salesPerson.name.first + ' ' + data.salesPerson.name.last;
                        }
                    }
                    if (data.salesTeam) {
                        if (data.salesTeam._id) {
                            _lead.salesTeam.id = data.salesTeam._id;
                        }
                        if (data.salesTeam.name) {
                            _lead.salesTeam.name = data.salesTeam.departmentName;
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
                        if (data.fax) {
                            _lead.phones.fax = data.phones.fax;
                        }
                    }
                    if (data.workflow) {
                        if (data.workflow._id) {
                            _lead.workflow.id = data.workflow._id;
                        }
                        if (data.workflow.name) {
                            _lead.workflow.name = data.workflow.name;
                        }
                    }
                    if (data.priority) {
                        if (data.priority._id) {
                            _lead.priority.id = data.priority._id;
                        }
                        if (data.priority.name) {
                            _lead.priority.name = data.priority.name;
                        }
                    }
                    if (data.categories) {
                        if (data.categories._id) {
                            _lead.categories.id = data.categories._id;
                        }
                        if (data.categories.name) {
                            _lead.categories.name = data.categories.name;
                        }
                    }
                    if (data.active) {
                        _lead.active = data.active;
                    }
                    if (data.optOut) {
                        _lead.optOut = data.optOut;
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
        catch (exception) {
            console.log(exception);
            logWriter.log("Leads.js  " + exception);
            res.send(500, { error: 'lead.save  error' });
        }
    };

    function get(response) {
        var res = {};
        res['data'] = [];
        var query = lead.find({});
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
        catch (exception) {
            console.log(exception);
            logWriter.log("Leads.js update " + exception);
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