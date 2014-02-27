var Customers = function (logWriter, mongoose, models, department) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var newObjectId = mongoose.Types.ObjectId;
    var customerSchema = mongoose.Schema({
        type: { type: String, default: '' },
        isOwn: { type: Boolean, default: false },
        name: {
            first: { type: String, default: 'demo' },
            last: { type: String, default: '' }
        },
        dateBirth: Date,
        imageSrc: { type: String, default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC' },
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
            fax: { type: String, default: '' }
        },
        contacts: { type: Array, default: [] },
        internalNotes: { type: String, default: '' },
        title: { type: String, default: '' },
        salesPurchases: {
            isCustomer: { type: Boolean, default: true },
            isSupplier: { type: Boolean, default: false },
            salesPerson: { type: ObjectId, ref: 'Employees', default: null },
            salesTeam: { type: ObjectId, ref: 'Department', default: null },
            active: { type: Boolean, default: true },
            reference: { type: String, default: '' },
            language: { type: String, default: 'English' },
            receiveMessages: { type: Number, default: 0 }
        },
        relatedUser: { type: ObjectId, ref: 'Users', default: null },
        color: { type: String, default: '#4d5a75' },
        social: {
            FB: { type: String, default: '' },
            LI: { type: String, default: '' }
        },
        whoCanRW: { type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne' },
        groups: {
            owner: { type: ObjectId, ref: 'Users', default: null },
            users: [{ type: ObjectId, ref: 'Users', default: null }],
            group: [{ type: ObjectId, ref: 'Department', default: null }]
        },
        notes: { type: Array, default: [] },
        attachments: { type: Array, default: [] },
        history: { type: Array, default: [] },
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        }
    }, { collection: 'Customers' });

    mongoose.model('Customers', customerSchema);

    return {

        getTotalCount: function (req, response) {
            var res = {};
            var data = {};
            for (var i in req.query) {
                data[i] = req.query[i];
            }
            res['showMore'] = false;

            var contentType = req.params.contentType;
            var optionsObject = {};

            switch (contentType) {
                case ('Persons'): {
                    optionsObject['type'] = 'Person';

                    if (data.filter.letter ){
                        optionsObject['name.last'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
                    }
                }
                    break;
                case ('Companies'): {
                    optionsObject['type'] = 'Company';
                    if (data.filter.letter)
                        optionsObject['name.first'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
                }
                    break;
                case ('ownCompanies'): {
                    optionsObject['type'] = 'Company';
                    optionsObject['isOwn'] = true;
                    if (data.letter)
                        optionsObject['name.first'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
                }
                    break;
            }


            models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
                {
                    $match: {
                        users: newObjectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },
                function (err, deps) {
                    if (!err) {
                        var arrOfObjectId = deps.objectID();
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                { whoCanRW: 'group' },
                                                                { 'groups.users': newObjectId(req.session.uId) }
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                { whoCanRW: 'group' },
                                                                { 'groups.group': { $in: arrOfObjectId } }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        { whoCanRW: 'owner' },
                                                        { 'groups.owner': newObjectId(req.session.uId) }
                                                    ]
                                                },
                                                { whoCanRW: "everyOne" }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            function (err, result) {
                                if (!err) {
                                    if (data.currentNumber && data.currentNumber < result.length) {
                                        res['showMore'] = true;
                                    }
                                    res['count'] = result.length;
                                    response.send(res);
                                } else {
                                    console.log(err);
                                    response.send(500, { error: 'Server Eroor' });
                                }
                            }
                        );

                    } else {
                        console.log(err);
                        response.send(500, { error: 'Server Eroor' });
                    }
                });
        },

        create: function (req, data, res) {
            try {
                if (!data) {
                    logWriter.log('Person.create Incorrect Incoming Data');
                    res.send(400, { error: 'Person.create Incorrect Incoming Data' });
                    return;
                } else {
                   var query = {};
                 /*   if (data.type) {
                        switch (data.type) {
                            case "Person":
                                {
                                    query = { $and: [{ 'name.first': data.name.first }, { 'name.last': data.name.last }, { type: 'Person' }] };
                                }
                                break;
                            case "Company":
                                {
                                    query = { $and: [{ 'name.first': data.name.first }, { 'name.last': data.name.last }, { type: 'Company' }] };
                                }
                                break;
                        }
                    }
                    models.get(req.session.lastDb - 1, "Customers", customerSchema).find(query, function (error, doc) {
                        if (error) {
                            logWriter.log('Person.js. create Person.find' + error);
                            res.send(500, { error: 'Person.create find error' });
                        } else {
                            if (doc.length > 0) {
                                res.send(500, { error: 'Person with same name alredy existds' });
                            } else if (doc.length === 0) {
                                savetoBd(data);
                            }
                        }
                    });*/
                    //Removed Persons same name Validation
                    if (data.type == "Company") {
                        query = { $and: [{ 'name.first': data.name.first }, { 'name.last': data.name.last }, { type: 'Company' }] };
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).find(query, function (error, doc) {
                            if (error) {
                                logWriter.log('Person.js. create Person.find' + error);
                                res.send(500, { error: 'Person.create find error' });
                            } else {
                                if (doc.length > 0) {
                                    res.send(500, { error: 'Person with same name alredy existds' });
                                } else if (doc.length === 0) {
                                    savetoBd(data);
                                }
                            }
                        });

                    }
                    else savetoBd(data);
                }
                function savetoBd(data) {
                    try {
                        _customer = new models.get(req.session.lastDb - 1, "Customers", customerSchema)();
                        if (data.uId) {
                            _customer.createdBy.user = data.uId;
                            //on creation addded uId to editBy field user value
                            _customer.editedBy.user = data.uId;
                        }
                        if (data.groups) {
                            _customer.groups = data.groups;
                        }
                        if (data.whoCanRW) {
                            _customer.whoCanRW = data.whoCanRW;
                        }
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

        getForDd: function (req, response) {
            var res = {};
            res['data'] = [];
            var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ 'relatedUser.id': { $ne: '' } }, { _id: 1, name: 1 });
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

        getPersons: function (req, response) {
            var res = {};
            res['data'] = [];
            var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ type: 'Person' });
            query.populate('company', '_id name').
                  populate('department', '_id departmentName').
                  populate('createdBy.user').
                  populate('editedBy.user');

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

        getFilterPersonsForMiniView: function (req, response, data) {
            console.log('------------get filter Persons-------------------');
            var res = {};
            var optionsObject = {};
            res['data'] = [];
            if (data.letter) {
                optionsObject['type'] = 'Person';
                optionsObject['name.last'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
            } else {
                optionsObject['type'] = 'Person';
            };
            models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
                {
                    $match: {
                        users: newObjectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },
                function (err, deps) {
                    if (!err) {
                        var arrOfObjectId = deps.objectID();
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
										{
										    company: newObjectId(data.companyId)
										},
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                { whoCanRW: 'group' },
                                                                { 'groups.users': newObjectId(req.session.uId) }
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                { whoCanRW: 'group' },
                                                                { 'groups.group': { $in: arrOfObjectId } }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        { whoCanRW: 'owner' },
                                                        { 'groups.owner': newObjectId(req.session.uId) }
                                                    ]
                                                },
                                                { whoCanRW: "everyOne" }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            function (err, result) {
                                if (!err) {
                                    var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find().where('_id').in(result);

                                    if (data.onlyCount.toString().toLowerCase() == "true") {

                                        query.count(function (error, _res) {
                                            if (!error) {
                                                res['listLength'] = _res;
                                                response.send(res);
                                            } else {
                                                console.log(error);
                                            }
                                        })
                                    } else {

                                        if (data && data.status && data.status.length > 0)
                                            query.where('workflow').in(data.status);
                                        query.select("_id name email phones.mobile").
                                            skip((data.page - 1) * data.count).
                                            limit(data.count).
                                            sort({ "name.first": 1 }).
                                            exec(function (error, _res) {
                                                if (!error) {
                                                    res['data'] = _res;
                                                    response.send(res);
                                                } else {
                                                    console.log(error);
                                                }
                                            });
                                    }
                                } else {
                                    console.log(err);
                                }
                            }
                        );

                    } else {
                        console.log(err);
                    }
                });
        },

        getPersonById: function (req, id, response) {
            var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).findById(id);
            query.populate('company', '_id name').
                  populate('department', '_id departmentName').
                  populate('createdBy.user').
                  populate('editedBy.user').
                  populate('groups.users').
                  populate('groups.group');

            query.exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("customer.js get customer.find " + err);
                    response.send(500, { error: "Can't find customer" });
                } else {
                    response.send(result);
                }
            });
        },

        getCompanyById: function (req, id, response) {
            console.log(id);
            var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).findById(id);
            query.populate('department', '_id departmentName').
            	  populate('salesPurchases.salesPerson', '_id name').
            	  populate('salesPurchases.salesTeam', '_id departmentName').
                  populate('createdBy.user').
                  populate('editedBy.user').
                  populate('groups.users').
                  populate('groups.group');

            query.exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("customer.js get customer.find " + err);
                    response.send(500, { error: "Can't find customer" });
                } else {
                    response.send(result);
                }
            });
        },

        getCompaniesForDd: function (req, response) {
            var res = {};
            res['data'] = [];
            var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ type: 'Company' });
            /*            query.populate('salesPurchases.salesPerson', '_id name').
                              populate('salesPurchases.salesTeam', '_id departmentName').
                              populate('createdBy.user').
                              populate('editedBy.user').
                              populate('groups.users').
                              populate('groups.group');
            */
            query.select("_id name.first")
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

        getCustomersAlphabet: function (req, response) {
            var data = {};
            for (var i in req.query) {
                data[i] = req.query[i];
            }

            var contentType = data.contentType;

            var searchName;
            var res = {};
            var optionsObject = {};
            switch (contentType) {
                case ('Persons'): {
                    optionsObject['type'] = 'Person';
                    searchName = "$name.last";
                }
                    break;
                case ('Companies'): {
                    optionsObject['type'] = 'Company';
                    searchName = "$name.first";
                }
                    break;
                case ('ownCompanies'): {
                    optionsObject['type'] = 'Company';
                    optionsObject['isOwn'] = true;
                    searchName = "$name.first";
                }
                    break;
            }
            models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
                {
                    $match: {
                        users: newObjectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },
                function (err, deps) {
                    if (!err) {
                        var arrOfObjectId = deps.objectID();
                        
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                { whoCanRW: 'group' },
                                                                { 'groups.users': newObjectId(req.session.uId) }
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                { whoCanRW: 'group' },
                                                                { 'groups.group': { $in: arrOfObjectId } }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        { whoCanRW: 'owner' },
                                                        { 'groups.owner': newObjectId(req.session.uId) }
                                                    ]
                                                },
                                                { whoCanRW: "everyOne" }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    later: { $substr: [searchName, 0, 1] }
                                }
                            },
                            {
                                $group: { _id: "$later" }
                            },
                            function (err, result) {
                                if (err) {
                                    logWriter.log("customer.js get person alphabet " + err);
                                    response.send(500, { error: "Can't find customer" });
                                } else {
                                    res['data'] = result;
                                    response.send(res);
                                }
                            }
                        );
                    }
                })
        },

        getCustomersImages: function (req, res) {
            var data = {};
            for (var i in req.query) {
                data[i] = req.query[i];
            }
            var optionsObject = {};

            var contentType = data.contentType;
            switch (contentType) {
                case ('Persons'): {
                    optionsObject['type'] = 'Person';
                }
                    break;
                case ('Companies'): {
                    optionsObject['type'] = 'Company';
                }
                    break;
                case ('ownCompanies'): {
                    optionsObject['type'] = 'Company';
                    optionsObject['isOwn'] = true;
                }
                    break;
            }

            var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find(optionsObject);
            query.where('_id').in(data.ids).
                select('_id imageSrc').
                exec(function (error, response) {
                    res.send(200,{data:response});
                });

        },

        getFilterCustomers: function (req, response) {
            var data = {};
            for (var i in req.query) {
                data[i] = req.query[i];
            }

            var viewType = data.viewType;
            var contentType = data.contentType;
            var res = {};
            res['data'] = [];
            var optionsObject = {};
            switch (contentType) {
                case ('Persons'): {
                    optionsObject['type'] = 'Person';
                    console.log(data)
                    if (data && data.filter && data.filter.letter)
                             optionsObject['name.last'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
                }
                    break;
                case ('Companies'): {
                    optionsObject['type'] = 'Company';
                    if (data && data.filter && data.filter.letter)
                             optionsObject['name.first'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
                }
                    break;
                case ('ownCompanies'): {
                    optionsObject['type'] = 'Company';
                    optionsObject['isOwn'] = true;
                    if (data.letter)
                        optionsObject['name.first'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
                }
                    break;
            }

            models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
                {
                    $match: {
                        users: newObjectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },
                function (err, deps) {
                    if (!err) {
                        var arrOfObjectId = deps.objectID();
                        
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                { whoCanRW: 'group' },
                                                                { 'groups.users': newObjectId(req.session.uId) }
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                { whoCanRW: 'group' },
                                                                { 'groups.group': { $in: arrOfObjectId } }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        { whoCanRW: 'owner' },
                                                        { 'groups.owner': newObjectId(req.session.uId) }
                                                    ]
                                                },
                                                { whoCanRW: "everyOne" }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            function (err, result) {
                                if (!err) {
                                    var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find().where('_id').in(result);
                                    if (data.status && data.status.length > 0)
                                        query.where('workflow').in(data.status);

                                    switch (contentType) {
                                        case ('Persons'):
                                            switch (viewType) {
                                                case ('list'): {
                                                    if (data.sort) {
                                                           query.sort(data.sort);
                                                    }
                                                    query.select("_id createdBy editedBy address.country email name phones.phone").
                                                        populate('createdBy.user', 'login').
                                                        populate('editedBy.user', 'login');
                                                }
                                                    break;
                                                case ('thumbnails'): {
                                                    query.select("_id name email").
                                                        populate('company', '_id name').
                                                        populate('department', '_id departmentName').
                                                        populate('createdBy.user').
                                                        populate('editedBy.user');
                                                }
                                                    break;

                                            }
                                            break;
                                        case ('Companies'):
                                            switch (viewType) {
                                                case ('list'): {
													if (data.sort) {
														query.sort(data.sort);
													}
                                                    query.select("_id editedBy createdBy salesPurchases name email phones.phone address.country").
                                                        populate('salesPurchases.salesPerson', '_id name').
                                                        populate('salesPurchases.salesTeam', '_id departmentName').
                                                        populate('createdBy.user', 'login').
                                                        populate('editedBy.user', 'login');
                                                }
                                                    break;
                                                case ('thumbnails'): {
                                                    query.select("_id name").
                                                        populate('company', '_id name address').
                                                        populate('createdBy.user').
                                                        populate('editedBy.user');
                                                }
                                                    break;

                                            }
                                            break;
                                        case ('ownCompanies'):
                                            switch (viewType) {
                                                case ('list'): {
                                                    query.populate('salesPurchases.salesPerson', '_id name').
                                                        populate('salesPurchases.salesTeam', '_id departmentName').
                                                        populate('createdBy.user').
                                                        populate('editedBy.user');
                                                }
                                                    break;
                                                case ('thumbnails'): {
                                                    query.select("_id name").
                                                        populate('company', '_id name address').
                                                        populate('createdBy.user').
                                                        populate('editedBy.user');
                                                }
                                                    break;
                                            }
                                            break;
                                    }

                                    query.skip((data.page - 1) * data.count).
                                        limit(data.count).
                                        exec(function (error, _res) {
                                            if (!error) {
                                                res['data'] = _res;
                                                response.send(res);
                                            } else {
                                                console.log(error);
                                            }
                                        });
                                } else {
                                    console.log(err);
                                }
                            }
                        );
                    } else {
                        console.log(err);
                    }
                });

        },

        getOwnCompanies: function (req, data, response) {

            var res = {}
            res['data'] = [];
            var i = 0;

            var qeryEveryOne = function (arrayOfId, n, workflowsId) {
                if (data.letter) {
                    var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ $and: [{ type: 'Company' }, { isOwn: true }], 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
                } else {
                    var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ $and: [{ type: 'Company' }, { isOwn: true }] });
                }

                if (workflowsId && workflowsId.length > 0)
                    query.where('workflow').in(workflowsId);

                query.where('_id').in(arrayOfId).
                    populate('salesPurchases.salesPerson', '_id name').
                    populate('salesPurchases.salesTeam', '_id departmentName').
                    populate('createdBy.user').
                    populate('editedBy.user').
                    exec(function (error, _res) {
                        if (!error) {
                            i++;
                            res['data'] = res['data'].concat(_res);
                            if (i == n) getOwnCompanies(res['data'], 0);
                        }
                    });
            };

            var qeryOwner = function (arrayOfId, n, workflowsId) {
                if (data.letter) {
                    var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ $and: [{ type: 'Company' }, { isOwn: true }], 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
                } else {
                    var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ $and: [{ type: 'Company' }, { isOwn: true }] });
                }
                if (workflowsId && workflowsId.length > 0)
                    query.where('workflow').in(workflowsId);

                query.where('_id').in(arrayOfId).
                    where({ 'groups.owner': data.uId }).
                    populate('salesPurchases.salesPerson', '_id name').
                    populate('salesPurchases.salesTeam', '_id departmentName').
                    populate('createdBy.user').
                    populate('editedBy.user').
                    exec(function (error, _res) {
                        if (!error) {
                            i++;
                            console.log(i);
                            console.log(n);
                            res['data'] = res['data'].concat(_res);
                            console.log(res['data']);
                            if (i == n) getOwnCompanies(res['data'], 0);;
                        } else {
                            console.log(error);
                        }
                    });
            };

            var qeryByGroup = function (arrayOfId, n) {
                if (data.letter) {
                    var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ $and: [{ type: 'Company' }, { isOwn: true }], 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
                } else {
                    var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ $and: [{ type: 'Company' }, { isOwn: true }] });
                }
                if (workflowsId && workflowsId.length > 0)
                    query.where('workflow').in(workflowsId);

                query.where({ 'groups.users': data.uId }).
                    populate('salesPurchases.salesPerson', '_id name').
                    populate('salesPurchases.salesTeam', '_id departmentName').
                    populate('createdBy.user').
                    populate('editedBy.user').

                    exec(function (error, _res1) {
                        if (!error) {
                            models.get(req.session.lastDb - 1, 'Department', department.DepartmentSchema).find({ users: data.uId }, { _id: 1 },
                                function (err, deps) {
                                    console.log(deps);
                                    if (!err) {
                                        if (data.letter) {
                                            var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ $and: [{ type: 'Company' }, { isOwn: true }], 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
                                        } else {
                                            var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ $and: [{ type: 'Company' }, { isOwn: true }] });
                                        }
                                        query.where('_id').in(arrayOfId).
                                            where('groups.group').in(deps).
                                            populate('salesPurchases.salesPerson', '_id name').
                                            populate('salesPurchases.salesTeam', '_id departmentName').
                                            populate('createdBy.user').
                                            populate('editedBy.user').
                                            exec(function (error, _res) {
                                                if (!error) {
                                                    i++;
                                                    console.log(i);
                                                    console.log(n);
                                                    res['data'] = res['data'].concat(_res1);
                                                    res['data'] = res['data'].concat(_res);
                                                    console.log(res['data']);
                                                    if (i == n) getOwnCompanies(res['data'], 0);;
                                                } else {
                                                    console.log(error);
                                                }
                                            });
                                    }
                                });
                        } else {
                            console.log(error);
                        }
                    });
            };
            var workflowsId = data ? data.status : null;
            models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                {
                    $group: {
                        _id: "$whoCanRW",
                        ID: { $push: "$_id" },
                        groupId: { $push: "$groups.group" }
                    }
                },
                function (err, result) {
                    if (!err) {
                        if (result.length != 0) {
                            result.forEach(function (_project) {
                                switch (_project._id) {
                                    case "everyOne":
                                        {
                                            qeryEveryOne(_project.ID, result.length, workflowsId);
                                        }
                                        break;
                                    case "owner":
                                        {
                                            qeryOwner(_project.ID, result.length, workflowsId);
                                        }
                                        break;
                                    case "group":
                                        {
                                            qeryByGroup(_project.ID, result.length, workflowsId);
                                        }
                                        break;
                                }
                            });
                        } else {
                            response.send(res);
                        }
                    } else {
                        console.log(err);
                    }
                }
            );

            var getOwnCompanies = function (ownCompanies, count) {
                var ownCompaniesSendArray = [];
                var startIndex, endIndex;

                if ((data.page - 1) * data.count > ownCompanies.length) {
                    startIndex = ownCompanies.length;
                } else {
                    startIndex = (data.page - 1) * data.count;
                }

                if (data.page * data.count > ownCompanies.length) {
                    endIndex = ownCompanies.length;
                } else {
                    endIndex = data.page * data.count;
                }

                for (var k = startIndex; k < endIndex; k++) {
                    ownCompaniesSendArray.push(ownCompanies[k]);
                }
                res['listLength'] = ownCompanies.length;
                res['data'] = ownCompaniesSendArray;
                response.send(res);
            }
        },

        getCustomers: function (req, response, data) {
            var res = {};
            res['data'] = [];
            var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ 'salesPurchases.isCustomer': true });
            if (data && data.id)
                query.where({ _id: newObjectId(data.id) });
            query.sort({ "name.first": 1 });
            query.exec(function (err, customers) {
                if (err) {
                    console.log(err);
                    logWriter.log("customer.js getCustomersForDd customer.find " + err);
                    response.send(500, { error: "Can't find Customer" });
                } else {
                    res['data'] = customers;
                    response.send(res);
                }
            });
        },

        update: function (req, _id, remove, data, res) {
            try {
                delete data._id;
                delete data.createdBy;
                if (data.notes && data.notes.length != 0 && !remove) {
                    var obj = data.notes[data.notes.length - 1];
                    obj._id = mongoose.Types.ObjectId();
                    obj.date = new Date();
                    data.notes[data.notes.length - 1] = obj;
                }
                if (data.company && data.company._id) {
                    data.company = data.company._id;
                }
                if (data.department && data.department._id) {
                    data.department = data.department._id;
                }
                if (data.salesPurchases && data.salesPurchases.salesPerson && data.salesPurchases.salesPerson._id) {
                    data.salesPurchases.salesPerson = data.salesPurchases.salesPerson._id;
                }
                if (data.salesPurchases && data.salesPurchases.salesTeam && data.salesPurchases.salesTeam._id) {
                    data.salesPurchases.salesTeam = data.salesPurchases.salesTeam._id;
                }
                models.get(req.session.lastDb - 1, "Customers", customerSchema).findByIdAndUpdate({ _id: _id }, data, function (err, customers) {
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

		updateOnlySelectedFields:function(req, _id, data, res) {
			delete data._id;
			if (data.notes && data.notes.length != 0) {
				var obj = data.notes[data.notes.length - 1];
                if (!obj._id)
				    obj._id = mongoose.Types.ObjectId();
				obj.date = new Date();
                if (!obj.author)
				    obj.author = req.session.uName;
				data.notes[data.notes.length - 1] = obj;
			}
			 
			models.get(req.session.lastDb - 1, 'Customers', customerSchema).findByIdAndUpdate({ _id: _id }, { $set: data }, function (err, result) {
				if (err) {
					console.log(err);
					logWriter.log("Customer.js update customer.update " + err);
					res.send(500, { error: "Can't update Customer" });
				} else {
					res.send(200,{ success: 'Customer update', notes: result.notes } );
				}
			});
		},

        remove: function (req, _id, res) {
            models.get(req.session.lastDb - 1, "Customers", customerSchema).remove({ _id: _id }, function (err, customer) {
                if (err) {
                    console.log(err);
                    logWriter.log("Project.js remove project.remove " + err);
                    res.send(500, { error: "Can't remove customer" });
                } else {
                    res.send(200, { success: 'customer removed' });
                }
            });
        },

        customerSchema: customerSchema
    }
};

module.exports = Customers;
