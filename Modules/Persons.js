var Persons = function (logWriter, mongoose) {

    var personsSchema = mongoose.Schema({
        name: {
            first: { type: String, default: 'demo' },
            last: { type: String, default: 'User' }
        },
        email: { type: String, default: '' },
        photoUrl: { type: String, default: '' },
        company: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        timezone: { type: String, default: 'UTC' },
        address: {
            street1: { type: String, default: '' },
            //street2: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        website: { type: String, default: '' },
        jobPosition: { type: String, default: '' },
        phones: {
            phone: { type: String, default: '' },
            mobile: { type: String, default: '' },
            fax: { type: String, default: '' },
        },
        title: { type: String, default: 'Mister' },
        salesPurchases: {
            isCustomer: { type: Boolean, default: false },
            isSupplier: { type: Boolean, default: false },
            salesPerson: { type: String, default: '' },
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
            uid: { type: String, default: '' },
            ulogin: { type: String, default: '' }
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
                if (typeof (data) == 'undefined') {
                    logWriter.log('Person.create Incorrect Incoming Data');
                    res.send(400, { error: 'Person.create Incorrect Incoming Data' });
                    return;
                } else {
                    var query = ((data.email == '') || (data.email == 'undefined'))
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
                        _person = new Person();
                        if (typeof (data.email) != 'undefined') {
                            _person.email = data.email;
                        }
                        if (typeof (data.photoUrl) != 'undefined') {
                            _person.photoUrl = data.photoUrl;
                        }
                        if (typeof (data.name) != 'undefined') {
                            if (typeof (data.name.first) != 'undefined') {
                                _person.name.first = data.name.first;
                            }
                            if (typeof (data.name.last) != 'undefined') {
                                _person.name.last = data.name.last;
                            }
                        }
                        if (typeof (data.company) != 'undefined') {
                            if (typeof (data.company.id) != 'undefined') {
                                _person.company.id = data.company.id;
                            }
                            if (typeof (data.company.name) != 'undefined') {
                                _person.company.name = data.company.name;
                            }
                        }
                        if (typeof (data.timezone) != 'undefined') {
                            _person.timezone = data.timezone;
                        }
                        if (typeof (data.address) != 'undefined') {
                            if (typeof (data.address.street1) != 'undefined') {
                                _person.address.street1 = data.address.street1;
                            }
                            if (typeof (data.address.street2) != 'undefined') {
                                _person.address.street2 = data.address.street2;
                            }
                            if (typeof (data.address.city) != 'undefined') {
                                _person.address.city = data.address.city;
                            }
                            if (typeof (data.address.state) != 'undefined') {
                                _person.address.state = data.address.state;
                            }
                            if (typeof (data.address.zip) != 'undefined') {
                                _person.address.zip = data.address.zip;
                            }
                            if (typeof (data.address.country) != 'undefined') {
                                _person.address.country = data.address.country;
                            }
                        }
                        if (typeof (data.website) != 'undefined') {
                            _person.website = data.website;
                        }
                        if (typeof (data.jobPosition) != 'undefined') {
                            _person.jobPosition = data.jobPosition;
                        }
                        if (typeof (data.phones) != 'undefined') {
                            if (typeof (data.phones.phone) != 'undefined') {
                                _person.phones.phone = data.phones.phone;
                            }
                            if (typeof (data.phones.mobile) != 'undefined') {
                                _person.phones.mobile = data.phones.mobile;
                            }
                            if (typeof (data.phones.fax) != 'undefined') {
                                _person.phones.fax = data.phones.fax;
                            }
                        }
                        if (typeof (data.title) != 'undefined') {
                            _person.title = data.title;
                        }
                        if (typeof (data.salesPurchases) != 'undefined') {
                            if (typeof (data.salesPurchases.active) != 'undefined') {
                                _person.salesPurchases.active = data.salesPurchases.active;
                            }
                            if (typeof (data.salesPurchases.language) != 'undefined') {
                                _person.salesPurchases.language = data.salesPurchases.language;
                            }
                            if (typeof (data.salesPurchases.isCustomer) != 'undefined') {
                                _person.salesPurchases.isCustomer = data.salesPurchases.isCustomer;
                            }
                            if (typeof (data.salesPurchases.isSupplier) != 'undefined') {
                                _person.salesPurchases.isSupplier = data.salesPurchases.isSupplier;
                            }
                            if (typeof (data.salesPurchases.salesPerson) != 'undefined') {
                                _person.salesPurchases.salesPerson = data.salesPurchases.salesPerson;
                            }
                            if (typeof (data.salesPurchases.salesTeam) != 'undefined') {
                                _person.salesPurchases.salesTeam = data.salesPurchases.salesTeam;
                            }
                            if (typeof (data.salesPurchases.reference) != 'undefined') {
                                _person.salesPurchases.reference = data.salesPurchases.reference;
                            }
                            if (typeof (data.salesPurchases.date) != 'undefined') {
                                _person.salesPurchases.date = data.salesPurchases.date;
                            }
                            if (typeof (data.salesPurchases.receiveMessages) != 'undefined') {
                                _person.salesPurchases.receiveMessages = data.usalesPurchases.receiveMessages;
                            }
                        }
                        if (typeof (data.relatedUser) != 'undefined') {
                            if (typeof (data.relatedUser.uid) != 'undefined') {
                                _person.relatedUser.uid = data.relatedUser.uid;
                            }
                            if (typeof (data.relatedUser.ulogin) != 'undefined') {
                                _person.relatedUser.ulogin = data.relatedUser.ulogin;
                            }
                        }
                        if (typeof (data.history) != 'undefined') {
                            _person.history = data.history;
                        }
                        _person.save(function (err, person) {
                            if (err) {
                                console.log(err);
                                logWriter.log("Person.js create savetoBd _person.save " + err);
                                res.send(500, { error: 'Person.save BD error' });
                            } else {
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
            Person.find({ 'relatedUser.uid': { $ne: '' } }, { _id: 1, name: 1 }, function (err, persons) {
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
            var res = {};
            res['data'] = [];
            var query = Person.find({});
            query.sort({ "name.last": 1 });
            query.exec(function (err, persons) {
                if (err) {
                    console.log(err);
                    logWriter.log("Person.js get Person.find " + err);
                    response.send(500, { error: "Can't find Person" });
                } else {
                    res['data'] = persons;
                    response.send(res);
                }
            });
        },

        getCustomers: function (response) {
            var res = {};
            res['data'] = [];
            //Person.find({ 'salesPurchases.isCustomer': true }, { _id: 1, name: 1 }, function (err, persons) {
            Person.find({ 'salesPurchases.isCustomer': true }, function (err, persons) {
                if (err) {
                    console.log(err);
                    logWriter.log("Person.js getCustomersForDd Person.find " + err);
                    response.send(500, { error: "Can't find Customer" });
                } else {
                    //console.log(accounts);
                    for (var i in persons) {
                        var obj = {};
                        obj._id = persons[i]._id;
                        obj.name = persons[i].name;
                        obj.type = 'Person';
                        res['data'].push(obj);
                    }
                    response.send(res);
                }
            });
        },

        update: function (_id, data, res) {
            try {
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
        }
    }
};

module.exports = Persons;