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
            fax: { type: String, default: '' }
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
            date: { type: Date }
        }
    }, { collection: 'Customers' });

    mongoose.model('Customers', customerSchema);

    return {
        create: function (req, data, res) {
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
                                res.send(400, { error: 'Person with same name alredy existds' });
                            } else if (doc.length === 0) {
                                savetoBd(data);
                            }
                        }
                    });
                }
                function savetoBd(data) {
                    try {
                        _customer = new models.get(req.session.lastDb - 1, "Customers", customerSchema)();
                        if (data.uId) {
                            _customer.createdBy.user = data.uId;
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
            console.log("------------------------------------");
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

        getPersonsListLength : function (req, response, data) {
            var res = {};
            var aggObject = {};
            if (data.letter) {
                aggObject['type'] = 'Person';
                aggObject['name.last'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
            } else {
                aggObject['type'] = 'Person';
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
                        console.log(arrOfObjectId);
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        aggObject,
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
                                                {
                                                    whoCanRW: "everyOne"
                                                }
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
                                    if (data && data.status && data.status.length > 0)
                                        query.where('workflow').in(data.status)
                                    query.exec(function (error, _res) {
                                            if (!error) {
                                                res['listLength'] = _res.length;
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

        getFilterPersons: function (req, data, response) {
            console.log('------------get filter Persons-------------------');
            var res = {};
            var aggObject = {};
            res['data'] = [];
            if (data.letter) {
                aggObject['type'] = 'Person';
                aggObject['name.last'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
            } else {
                aggObject['type'] = 'Person';
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
                                        aggObject,
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
                                    if (data && data.status && data.status.length > 0)
                                        query.where('workflow').in(data.status);
                                        query.populate('company', '_id name').
                                        populate('department', '_id departmentName').
                                        populate('createdBy.user').
                                        populate('editedBy.user').
                                        skip((data.page-1)*data.count).
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
		getFilterPersonsForMiniView: function (req, response, data ) {
            console.log('------------get filter Persons-------------------');
            var res = {};
            var aggObject = {};
            res['data'] = [];
            if (data.letter) {
                aggObject['type'] = 'Person';
                aggObject['name.last'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
            } else {
                aggObject['type'] = 'Person';
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
                                        aggObject,
										{
											company:newObjectId(data.companyId)
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

                                if (data.onlyCount.toString().toLowerCase()=="true"){

                                    query.count(function(error,_res){
                                        if (!error) {
                                            res['listLength'] = _res;
                                            response.send(res);
                                        } else {
                                            console.log(error);
                                        }
                                    })
                                }else{

                                    if (data && data.status && data.status.length > 0)
                                        query.where('workflow').in(data.status);
                                    query.select("_id name email phones.mobile").
                                        skip((data.page-1)*data.count).
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
        getFilterPersonsForList: function (req, data, response) {
            var res = {};
            res['data'] = [];

            var aggObject = {};
            if (data.letter) {
                aggObject['type'] = 'Person';
                aggObject['name.last'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
            } else {
                aggObject['type'] = 'Person';
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
                        console.log(arrOfObjectId);
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        aggObject,
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
                                    if (data && data.status && data.status.length > 0)
                                        query.where('workflow').in(data.status);
                                    query.select("_id createdBy editedBy address.country email name phones.phone").
                                        populate('createdBy.user','login').
                                        populate('editedBy.user','login').
                                        skip((data.page-1)*data.count).
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

        getPersonAlphabet: function (req, response) {
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
                        console.log(arrOfObjectId);
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        {
                                            type: 'Person'
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
                                    _id: 1,
                                    later: { $substr: ["$name.last", 0, 1] }
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
                                    var res = {};
                                    res['data'] = result;
                                    response.send(res);
                                }
                            }
                        );
                    }
                })
        },

        getCompaniesAlphabet: function (req, response) {
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
                        console.log(arrOfObjectId);
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        {
                                            type: 'Company'
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
                                    _id: 1,
                                    later: { $substr: ["$name.first", 0, 1] }
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
                                    console.log('========== getCompaniesAlphabet ===========');
                                    console.log(result);
                                    var res = {};
                                    res['data'] = result;
                                    response.send(res);
                                }
                            }
                        );
                    }
                })
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

        getFilterCompanies: function (req, data, response) {
            var res = {};
            res['data'] = [];

            var aggObject = {};
            if (data.letter) {
                aggObject['type'] = 'Company';
                aggObject['name.first'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
            } else {
                aggObject['type'] = 'Company';
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
                        console.log(arrOfObjectId);
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        aggObject,
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
                                    if (data && data.status && data.status.length > 0)
                                        query.where('workflow').in(data.status);
                                    query.populate('salesPurchases.salesPerson', '_id name').
                                        populate('salesPurchases.salesTeam', '_id departmentName').
                                        populate('createdBy.user').
                                        populate('editedBy.user').
                                        skip((data.page-1)*data.count).
                                        limit(data.count).
                                        exec(function (error, _res) {
                                            if (!error) {
                                                res['data'] = _res;
                                                res['listLength'] = _res.length;
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
        getFilterCompaniesForList: function (req, data, response) {
            var res = {};
            res['data'] = [];

            var aggObject = {};
            if (data.letter) {
                aggObject['type'] = 'Company';
                aggObject['name.first'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
            } else {
                aggObject['type'] = 'Company';
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
                        console.log(arrOfObjectId);
                        models.get(req.session.lastDb - 1, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        aggObject,
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
                                    if (data && data.status && data.status.length > 0)
                                        query.where('workflow').in(data.status);
                                    query.select("_id editedBy createdBy salesPurchases name email phones.phone address.country").
										populate('salesPurchases.salesPerson', '_id name').
                                        populate('salesPurchases.salesTeam', '_id departmentName').
                                        populate('createdBy.user','login').
                                        populate('editedBy.user','login').
                                        skip((data.page-1)*data.count).
                                        limit(data.count).
                                        exec(function (error, _res) {
                                            if (!error) {
                                                res['data'] = _res;
                                                res['listLength'] = _res.length;
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
                    var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ $and: [{ type: 'Company' }, { isOwn: true }]});
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

        getCustomers: function (req, response) {

            var res = {};
            res['data'] = [];
            var query = models.get(req.session.lastDb - 1, "Customers", customerSchema).find({ 'salesPurchases.isCustomer': true });
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

        remove: function (req, _id, res) {
            models.get(req.session.lastDb - 1, "Customers", customerSchema).remove({ _id: _id }, function (err, customer) {
                if (err) {
                    console.log(err);
                    logWriter("Project.js remove project.remove " + err);
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
