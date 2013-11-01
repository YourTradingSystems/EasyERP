var Persons = function (logWriter, mongoose, findCompany) {

    var personsSchema = mongoose.Schema({
        type:{type: String, default: 'Person'},
        name: {
            first: { type: String, default: 'demo' },
            last: { type: String, default: 'User' }
        },
        imageSrc: { type: String, default: '' },
        email: { type: String, default: '' },
        photoUrl: { type: String, default: '' },
        company: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
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
        title: { type: String, default: 'Mister' },
        salesPurchases: {
            isCustomer: { type: Boolean, default: false },
            isSupplier: { type: Boolean, default: false },
            salesPerson: {
                id: { type: String, default: '' },
                name: { type: String, default: '' }
            },
            salesTeam: { type: String, default: '' },
            active: { type: Boolean, default: true },
            reference: { type: String, default: '' },
            language: { type: String, default: 'English' },
            date: {
                createDate: { type: Date, default: Date.now },
                updateDate: { type: Date, default: Date.now }
            },
            receiveMessages: { type: Number, default: 0 }
        },
        relatedUser: {
            id: { type: String, default: '' },
            login: { type: String, default: '' }
        },
        social: {
            FB: { type: String, default: '' },
            LI: { type: String, default: '' }
        },
        history: { type: Array, default: [] }
    }, { collection: 'Persons' });

    var Person = mongoose.model('Persons', personsSchema);

    return {
        create: function (data, res) {
            try {
                if (!data) {
                    logWriter.log('Person.create Incorrect Incoming Data');
                    res.send(400, { error: 'Person.create Incorrect Incoming Data' });
                    return;
                } else {
                    var query = (!data.email)
                        ? { $and: [{ 'name.first': data.name.first }, { 'name.last': data.name.last }] }
                        : { email: data.email };
                    Person.find(query, function (error, doc) {
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
                        console.log(data);
                        _person = new Person();
                        if (data.imageSrc) {
                            _person.imageSrc = data.imageSrc;
                        }
                        if (data.email) {
                            _person.email = data.email;
                        }
                        if (data.photoUrl) {
                            _person.photoUrl = data.photoUrl;
                        }
                        if (data.name) {
                            if (data.name.first) {
                                _person.name.first = data.name.first;
                            }
                            if (data.name.last) {
                                _person.name.last = data.name.last;
                            }
                        }
                        if (data.company) {
                            if (data.company._id) {
                                _person.company.id = data.company._id;
                            }
                            if (data.company.name) {
                                _person.company.name = data.company.name;
                            }
                        }
                        if (data.timezone) {
                            _person.timezone = data.timezone;
                        }
                        if (data.address) {
                            if (data.address.street) {
                                _person.address.street = data.address.street;
                            }
                            if (data.address.city) {
                                _person.address.city = data.address.city;
                            }
                            if (data.address.state) {
                                _person.address.state = data.address.state;
                            }
                            if (data.address.zip) {
                                _person.address.zip = data.address.zip;
                            }
                            if (data.address.country) {
                                _person.address.country = data.address.country;
                            }
                        }
                        if (data.website) {
                            _person.website = data.website;
                        }
                        if (data.jobPosition) {
                            _person.jobPosition = data.jobPosition;
                        }
                        if (data.skype) {
                            _person.skype = data.skype;
                        }
                        if (data.phones) {
                            if (data.phones.phone) {
                                _person.phones.phone = data.phones.phone;
                            }
                            if (data.phones.mobile) {
                                _person.phones.mobile = data.phones.mobile;
                            }
                            if (data.phones.fax) {
                                _person.phones.fax = data.phones.fax;
                            }
                        }
                        if (data.title) {
                            _person.title = data.title;
                        }
                        if (data.salesPurchases) {
                            if (data.salesPurchases.active) {
                                _person.salesPurchases.active = data.salesPurchases.active;
                            }
                            if (data.salesPurchases.language) {
                                _person.salesPurchases.language = data.salesPurchases.language;
                            }
                            if (data.salesPurchases.isCustomer) {
                                _person.salesPurchases.isCustomer = data.salesPurchases.isCustomer;
                            }
                            if (data.salesPurchases.isSupplier) {
                                _person.salesPurchases.isSupplier = data.salesPurchases.isSupplier;
                            }
                            if (data.salesPurchases.salesPerson) {
                                if (data.salesPerson._id) {
                                    _person.salesPurchases.salesPerson.id = data.salesPurchases.salesPerson._id;
                                }
                                if (data.salesPerson.name) {
                                    _person.salesPurchases.salesPerson.name = data.salesPurchases.salesPerson.name.first + ' ' + data.salesPurchases.salesPerson.name.last;
                                }
                            }
                            if (data.salesPurchases.salesTeam) {
                                _person.salesPurchases.salesTeam = data.salesPurchases.salesTeam;
                            }
                            if (data.salesPurchases.reference) {
                                _person.salesPurchases.reference = data.salesPurchases.reference;
                            }
                            if (data.salesPurchases.date) {
                                _person.salesPurchases.date = data.salesPurchases.date;
                            }
                            if (data.salesPurchases.receiveMessages) {
                                _person.salesPurchases.receiveMessages = data.usalesPurchases.receiveMessages;
                            }
                            if (data.imageSrc) {
                                _person.imageSrc = data.imageSrc;
                            }
                        }
                        if (data.relatedUser) {
                            if (data.relatedUser._id) {
                                _person.relatedUser.id = data.relatedUser._id;
                            }
                            if (data.relatedUser.login) {
                                _person.relatedUser.login = data.relatedUser.login;
                            }
                        }
                        if (data.history) {
                            _person.history = data.history;
                        }
                        _person.save(function (err, result) {
                            if (err) {
                                console.log(err);
                                logWriter.log("Person.js create savetoBd _person.save " + err);
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
            var query = Person.find({ 'relatedUser.id': { $ne: '' } }, { _id: 1, name: 1 });
            query.sort({ name: 1 });
            query.exec(function (err, persons) {
                if (err) {
                    response.send(500, { error: "Can't find Person" });
                    console.log(err);
                    logWriter.log("Person.js geForDd Person.find " + err);
                } else {
                    res['data'] = persons;
                    response.send(res);
                }
            });
        },

        get: function (response) {
            var query = Person.find({});
            query.sort({ "name.first": 1 });
            query.exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("Person.js get Person.find " + err);
                    response.send(500, { error: "Can't find Person" });
                } else {
                    findCompany.findCompany(result, 0, response);
                }
            });
        },

        getCustomers: function (company, response) {
            var res = {};
            res['data'] = [];
            var query = Person.find({ 'salesPurchases.isCustomer': true });
            query.sort({ "name.first": 1 });
            query.exec(function (err, persons) {
                if (err) {
                    console.log(err);
                    logWriter.log("Person.js getCustomersForDd Person.find " + err);
                    response.send(500, { error: "Can't find Customer" });
                } else {
                    for (var i in persons) {
                        var obj = {};
                        obj = persons[i];
                        obj.name = obj.name.first + ' ' + obj.name.last;
                        obj.type = 'Person';
                        res['data'].push(obj);
                    }
                    //response.send(res);
                    company.getCustomers(res, response);
                }
            });
        },

        update: function (_id, data, res) {
            try {
                console.log(data);
                delete data._id;
                Person.update({ _id: _id }, data, function (err, persons) {
                    if (err) {
                        console.log(err);
                        errorLog("Project.js update project.update " + err);
                        res.send(500, { error: "Can't update Person" });
                    } else {
                        res.send(200, { success: 'Person updated success' });
                    }
                });
            }
            catch (Exception) {
                console.log(Exception);
                errorLog("Project.js update " + Exception);
                res.send(500, { error: 'Person updated error' });
            }
        },

        remove: function (_id, res) {
            Person.remove({ _id: _id }, function (err, person) {
                if (err) {
                    console.log(err);
                    errorLog("Project.js remove project.remove " + err);
                    res.send(500, { error: "Can't remove Person" });
                } else {
                    res.send(200, { success: 'Person removed' });
                }
            });
        },

        Person: Person
    }
};

module.exports = Persons;