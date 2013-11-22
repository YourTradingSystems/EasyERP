var Customers = function (logWriter, mongoose, findCompany) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var customerSchema = mongoose.Schema({
        type: { type: String, default: '' },
        isOwn: { type: Boolean, default: false },
        name: {
            first: { type: String, default: 'demo' },
            last: { type: String, default: '' }
        },
        dateBirth: Date,
        imageSrc: { type: String, default: '' },
        email: { type: String, default: '' },
        company: { type: ObjectId, ref: 'Customers', default: null },
        department: { type: ObjectId, ref: 'Department', default: null },
        timezone: { type: String, default: 'UTC' },
        address: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        website: { type: String, default: '' },
        jobPosition: { type: String, default: '' },
        skype: { type: String, default: '' },
        phones: {
            phone: { type: String, default: '' },
            mobile: { type: String, default: '' },
            fax: { type: String, default: '' },
        },
        contacts: { type: Array, default: [] },
        internalNotes: { type: String, default: '' },
        title: { type: String, default: '' },
        salesPurchases: {
            isCustomer: { type: Boolean, default: false },
            isSupplier: { type: Boolean, default: false },
            salesPerson: { type: ObjectId, ref: 'Employees', default: null },
            salesTeam: { type: ObjectId, ref: 'Department', default: null },
            active: { type: Boolean, default: true },
            reference: { type: String, default: '' },
            language: { type: String, default: 'English' },
            date: {
                createDate: { type: Date, default: Date.now },
                updateDate: { type: Date, default: Date.now }
            },
            receiveMessages: { type: Number, default: 0 }
        },
        relatedUser: { type: ObjectId, ref: 'Users', default: null },
        color: { type: String, default: '#4d5a75' },
        social: {
            FB: { type: String, default: '' },
            LI: { type: String, default: '' }
        },
        notes: { type: Array, default: [] },
        attachments: { type: Array, default: [] },
        history: { type: Array, default: [] }
    }, { collection: 'Customers' });

    var customer = mongoose.model('Customers', customerSchema);

    return {
        create: function (data, res) {
            try {
                if (!data) {
                    logWriter.log('Person.create Incorrect Incoming Data');
                    res.send(400, { error: 'Person.create Incorrect Incoming Data' });
                    return;
                } else {
                    var query = {};
                    if (data.type) {
                        switch (data.type) {
                            case "Person":
                                {
                                    query = (!data.email)
                                        ? { $and: [{ 'name.first': data.name.first }, { 'name.last': data.name.last }, { type: 'Person' }] }
                                        : { email: data.email };
                                }
                                break;
                            case "Company":
                                {
                                    query = { $and: [{ 'name.first': data.name.first }, { 'name.last': data.name.last }, { type: 'Company' }] }
                                }
                                break;
                        }
                    }
                    customer.find(query, function (error, doc) {
                        if (error) {
                            logWriter.log('Person.js. create Person.find' + error);
                            res.send(500, { error: 'Person.create find error' });
                        } else {
                            if (doc.length > 0) {
                                res.send(400, { error: 'Person with same name alredy existds' });
                            } else if (doc.length === 0) {
                                savetoBd(data);
                            }
                        }
                    });
                }
                function savetoBd(data) {
                    try {
                        _customer = new customer();
                        if (data.type) {
                            _customer.type = data.type;
                        }
                        if (data.isOwn) {
                            _customer.isOwn = data.isOwn;
                        }
                        if (data.imageSrc) {
                            _customer.imageSrc = data.imageSrc;
                        }
                        if (data.email) {
                            _customer.email = data.email;
                        }
                        if (data.dateBirth) {
                            _customer.dateBirth = new Date(data.dateBirth);
                        }
                        if (data.name) {
                            if (data.name.first) {
                                _customer.name.first = data.name.first;
                            }
                            if (data.name.last) {
                                _customer.name.last = data.name.last;
                            }
                        }
                        if (data.company) {
                            _customer.company = data.company;
                        }
                        if (data.department) {
                            _customer.department = data.department;
                        }
                        if (data.timezone) {
                            _customer.timezone = data.timezone;
                        }
                        if (data.address) {
                            if (data.address.street) {
                                _customer.address.street = data.address.street;
                            }
                            if (data.address.city) {
                                _customer.address.city = data.address.city;
                            }
                            if (data.address.state) {
                                _customer.address.state = data.address.state;
                            }
                            if (data.address.zip) {
                                _customer.address.zip = data.address.zip;
                            }
                            if (data.address.country) {
                                _customer.address.country = data.address.country;
                            }
                        }
                        if (data.website) {
                            _customer.website = data.website;
                        }
                        if (data.jobPosition) {
                            _customer.jobPosition = data.jobPosition;
                        }
                        if (data.skype) {
                            _customer.skype = data.skype;
                        }
                        if (data.phones) {
                            if (data.phones.phone) {
                                _customer.phones.phone = data.phones.phone;
                            }
                            if (data.phones.mobile) {
                                _customer.phones.mobile = data.phones.mobile;
                            }
                            if (data.phones.fax) {
                                _customer.phones.fax = data.phones.fax;
                            }
                        }
                        if (data.contacts) {
                            _customer.contacts = data.contacts;
                        }
                        if (data.internalNotes) {
                            _customer.internalNotes = data.internalNotes;
                        }
                        if (data.title) {
                            _customer.title = data.title;
                        }
                        if (data.salesPurchases) {
                            if (data.salesPurchases.active) {
                                _customer.salesPurchases.active = data.salesPurchases.active;
                            }
                            if (data.salesPurchases.language) {
                                _customer.salesPurchases.language = data.salesPurchases.language;
                            }
                            if (data.salesPurchases.isCustomer) {
                                _customer.salesPurchases.isCustomer = data.salesPurchases.isCustomer;
                            }
                            if (data.salesPurchases.isSupplier) {
                                _customer.salesPurchases.isSupplier = data.salesPurchases.isSupplier;
                            }
                            if (data.salesPurchases.salesPerson) {
                                _customer.salesPurchases.salesPerson = data.salesPurchases.salesPerson;
                            }
                            if (data.salesPurchases.salesTeam) {
                                _customer.salesPurchases.salesTeam = data.salesPurchases.salesTeam;
                            }
                            if (data.salesPurchases.reference) {
                                _customer.salesPurchases.reference = data.salesPurchases.reference;
                            }
                            //if (data.salesPurchases.date) {
                            //    _customer.salesPurchases.date = data.salesPurchases.date;
                            //}
                            if (data.salesPurchases.receiveMessages) {
                                _customer.salesPurchases.receiveMessages = data.usalesPurchases.receiveMessages;
                            }
                            if (data.imageSrc) {
                                _customer.imageSrc = data.imageSrc;
                            }
                        }
                        if (data.relatedUser) {
                            _customer.relatedUser = data.relatedUser;
                        }
                        if (data.history) {
                            _customer.history = data.history;
                        }
                        if (data.notes) {
                            _customer.notes = data.notes;
                        }
                        if (data.attachments) {
                            _customer.attachments = data.attachments;
                        }
                        _customer.save(function (err, result) {
                            if (err) {
                                console.log(err);
                                logWriter.log("Person.js create savetoBd _customer.save " + err);
                                res.send(500, { error: 'Person.save BD error' });
                            } else {
                                console.log(result);
                                res.send(201, { success: 'A new Person crate success' });
                            }
                        });

                    }
                    catch (error) {
                        console.log(error);
                        logWriter.log("Person.js create savetoBd" + error);
                        res.send(500, { error: 'Person.save  error' });
                    }
                }
            }
            catch (Exception) {
                console.log(Exception);
                logWriter.log("Person.js  " + Exception);
                res.send(500, { error: 'Person.save  error' });
            }
        },//End create

        getForDd: function (response) {
            var res = {};
            res['data'] = [];
            var query = customer.find({ 'relatedUser.id': { $ne: '' } }, { _id: 1, name: 1 });
            query.sort({ name: 1 });
            query.exec(function (err, customers) {
                if (err) {
                    response.send(500, { error: "Can't find customer" });
                    console.log(err);
                    logWriter.log("customer.js geForDd customer.find " + err);
                } else {
                    res['data'] = customers;
                    response.send(res);
                }
            });
        },

        getPersons: function (response) {
            var res = {};
            res['data'] = [];
            var query = customer.find({ type: 'Person' });
            query.populate('company', '_id name').
                  populate('department', '_id departmentName');
            query.sort({ "name.first": 1 });
            query.exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("customer.js get customer.find " + err);
                    response.send(500, { error: "Can't find customer" });
                } else {
                    res['data'] = result;
                    response.send(res);
                }
            });
        },

        getCompanies: function (response) {
            var res = {};
            res['data'] = [];
            var query = customer.find({ type: 'Company' });
            query.populate('salesPurchases.salesPerson', '_id name').
                  populate('salesPurchases.salesTeam', '_id departmentName');
            query.sort({ "name.first": 1 });
            query.exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("customer.js get customer.find " + err);
                    response.send(500, { error: "Can't find customer" });
                } else {
                    res['data'] = result;
                    response.send(res);
                }
            });
        },

        getOwnCompanies: function (response) {
            var res = {};
            res['data'] = [];
            var query = customer.find({ $and: [{ type: 'Company' }, { isOwn: true }] });
            query.populate('salesPurchases.salesPerson', '_id name').
                  populate('salesPurchases.salesTeam', '_id departmentName');
            query.sort({ "name.first": 1 });
            query.exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("customer.js get customer.find " + err);
                    response.send(500, { error: "Can't find customer" });
                } else {
                    res['data'] = result;
                    response.send(res);
                }
            });
        },

        getCustomers: function (company, response) {
            var res = {};
            res['data'] = [];
            var query = customer.find({ 'salesPurchases.isCustomer': true });
            query.sort({ "name.first": 1 });
            query.exec(function (err, customers) {
                if (err) {
                    console.log(err);
                    logWriter.log("customer.js getCustomersForDd customer.find " + err);
                    response.send(500, { error: "Can't find Customer" });
                } else {
                    for (var i in customers) {
                        var obj = {};
                        obj = customers[i];
                        obj.name = obj.name.first + ' ' + obj.name.last;
                        obj.type = 'customer';
                        res['data'].push(obj);
                    }
                    //response.send(res);
                    company.getCustomers(res, response);
                }
            });
        },

        update: function (_id, remove, data, res) {
            try {
                console.log(data);
                delete data._id;
                if (data.notes.length != 0 && !remove) {
                    var obj = data.notes[data.notes.length - 1];
                    obj._id = mongoose.Types.ObjectId();
                    obj.date = new Date();
                    data.notes[data.notes.length - 1] = obj;
                }
                customer.findByIdAndUpdate({ _id: _id }, data, function (err, customers) {
                    if (err) {
                        console.log(err);
                        logWriter.log("Customer.js update customer.update " + err);
                        res.send(500, { error: "Can't update customer" });
                    } else {
                        console.log(customers);
                        res.send(200, customers);
                    }
                });
            }
            catch (Exception) {
                console.log(Exception);
                logWriter.log("Customer.js update " + Exception);
                res.send(500, { error: 'customer updated error' });
            }
        },

        remove: function (_id, res) {
            customer.remove({ _id: _id }, function (err, customer) {
                if (err) {
                    console.log(err);
                    logWriter("Project.js remove project.remove " + err);
                    res.send(500, { error: "Can't remove customer" });
                } else {
                    res.send(200, { success: 'customer removed' });
                }
            });
        },

        customer: customer
    }
};

module.exports = Customers;