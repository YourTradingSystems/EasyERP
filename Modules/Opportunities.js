var Opportunities = function (logWriter, mongoose, customer, workflow, department) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var newObjectId = mongoose.Types.ObjectId;
    var opportunitiesSchema = mongoose.Schema({
        isOpportunitie: { type: Boolean, default: false },
        name: { type: String, default: '' },
        expectedRevenue: {
            value: { type: Number, default: '' },
            progress: { type: Number, default: '' },
            currency: { type: String, default: '' }
        },
        creationDate: { type: Date, default: Date.now },
        tempCompanyField: { type: String, default: '' },                    //����� �����? � ˳��, �� ���� ����������� � ������
        company: { type: ObjectId, ref: 'Customers', default: null },
        customer: { type: ObjectId, ref: 'Customers', default: null },
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
        salesPerson: { type: ObjectId, ref: 'Employees', default: null },
        salesTeam: { type: ObjectId, ref: 'Department', default: null },
        internalNotes: { type: String, default: '' },
        nextAction: {
            desc: { type: String, default: '' },
            date: { type: Date, default: Date.now }
        },
        expectedClosing: { type: Date, default: null },
        priority: { type: String, default: 'Trivial' },
        categories: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        color: { type: String, default: '#4d5a75' },
        active: { type: Boolean, default: true },
        optout: { type: Boolean, default: false },
        reffered: { type: String, default: '' },
        workflow: { type: ObjectId, ref: 'workflows', default: null },
        whoCanRW: { type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne' },
        groups: {
            owner: { type: ObjectId, ref: 'Users', default: null },
            users: [{ type: ObjectId, ref: 'Users', default: null }],
            group: [{ type: ObjectId, ref: 'Department', default: null }]
        },
        info: {
            StartDate: Date,
            EndDate: Date,
            duration: Number,
            sequence: { type: Number, default: 0 },
            parent: { type: String, default: null }
        },
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        },
        campaign: { type: String, default: '' },
        source: { type: String, default: '' }
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
                        if (data.company.id) {
                            _opportunitie.company = data.company.id;
                        } else if (data.company.name) {
                            _opportunitie.tempCompanyField = data.company.name;
                        }
                    }
                    if (data.customer) {
                        _opportunitie.customer = data.customer;
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
                        _opportunitie.salesPerson = data.salesPerson;
                    }
                    if (data.salesTeam) {
                        _opportunitie.salesTeam = data.salesTeam;
                    }
                    if (data.internalNotes) {
                        _opportunitie.internalNotes = data.internalNotes;
                    }
                    if (data.nextAction) {
                        if (data.nextAction.desc) {
                            _opportunitie.nextAction.desc = data.nextAction.desc;
                        }
                        if (data.nextAction.date) {
                            _opportunitie.nextAction.date = new Date(data.nextAction.date);
                        }
                    }
                    if (data.expectedClosing) {
                        _opportunitie.expectedClosing = new Date(data.expectedClosing);
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
                    if (data.groups) {
                        _opportunitie.groups = data.groups;
                    }
                    if (data.whoCanRW) {
                        _opportunitie.whoCanRW = data.whoCanRW;
                    }
                    if (data.info) {
                        if (data.info.StartDate) {
                            _opportunitie.info.StartDate = data.info.StartDate;
                        }
                        if (data.info.EndDate) {
                            _opportunitie.info.EndDate = data.info.EndDate;
                        }
                        if (data.info.sequenc) {
                            _opportunitie.info.sequence = data.info.sequence;
                        }
                        if (data.info.parent) {
                            _opportunitie.info.parent = data.info.parent;
                        }

                    }
                    if (data.workflow) {
                        _opportunitie.workflow = data.workflow;
                    }
                    if (data.active) {
                        _opportunitie.active = data.active;
                    }
                    if (data.optout) {
                        _opportunitie.optout = data.optout;
                    }
                    if (data.reffered) {
                        _opportunitie.reffered = data.reffered;
                    }
                    if (data.uId) {
                        _opportunitie.createdBy.user = data.uId;
                    }
                    if (data.campaign) {
                        _opportunitie.campaign = data.campaign;
                    }
                    if (data.source) {
                        _opportunitie.source = data.source;
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
        var query = opportunitie.find({ isOpportunitie: true });
        query.sort({ name: 1 });
        query.populate('company customer salesPerson salesTeam workflow').
            populate('createdBy.user').
            populate('editedBy.user');

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

    function getById(id, response) {
        var query = opportunitie.findById(id);
        query.populate('company customer salesPerson salesTeam workflow').
            populate('groups.users').
            populate('groups.group').
            populate('createdBy.user').
            populate('editedBy.user');

        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Opportunities.js get job.find' + err);
                response.send(500, { error: "Can't find Opportunities" });
            } else {
                response.send(result);
            }
        });
    };

    function getLeads(response) {
        var res = {};
        res['data'] = [];
        var query = opportunitie.find({ isOpportunitie: false });
        query.sort({ name: 1 });
        query.populate('customer salesPerson salesTeam workflow').
            populate('createdBy.user').
            populate('editedBy.user');

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

    function getLeadsCustom(data, response) {
        var res = {};
        res['data'] = [];

        var i = 0;
        var qeryEveryOne = function (arrayOfId, n) {
            opportunitie.find({ isOpportunitie: false });
                opportunitie.where('_id').in(arrayOfId);
                if (data && data.status && data.status.length>0)
                    opportunitie.where('workflow').in(data.status);
                opportunitie.populate('customer salesPerson salesTeam workflow').
                    populate('createdBy.user').
                    populate('editedBy.user').
                    exec(function (error, _res) {
                    if (!error) {
                        i++;
                        res['data'] = res['data'].concat(_res);
                        if (i == n) {
                            getOpportunities(res['data'], data);
                        }
                    }
                });
        };

        var qeryOwner = function (arrayOfId, n) {
            opportunitie.find({ isOpportunitie: false }).
                where('_id').in(arrayOfId).
                where({ 'groups.owner': data.uId });
            if (data && data.status && data.status.length>0)
                opportunitie.where('workflow').in(data.status);
            opportunitie.populate('customer salesPerson salesTeam workflow').
                populate('createdBy.user').
                populate('editedBy.user').

                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        res['data'] = res['data'].concat(_res);
                        if (i == n) {
                            getOpportunities(res['data'], data);
                        }
                    } else {
                        console.log(error);
                    }
                });
        };

        var qeryByGroup = function (arrayOfId, n) {
            opportunitie.find({ isOpportunitie: false }).
                where({ 'groups.users': data.uId });
            if (data && data.status && data.status.length>0)
                opportunitie.where('workflow').in(data.status);
            opportunitie.populate('customer salesPerson salesTeam workflow').
                populate('createdBy.user').
                populate('editedBy.user').


                exec(function (error, _res1) {
                    if (!error) {
                        department.department.find({ users: data.uId }, { _id: 1 },
                            function (err, deps) {
                                if (!err) {
                                    opportunitie.find({ isOpportunitie: false }).
                                        where('_id').in(arrayOfId).
                                        where('groups.group').in(deps);
                                    if (data && data.status && data.status.length>0)
                                        opportunitie.where('workflow').in(data.status);
                                    opportunitie.populate('customer salesPerson salesTeam workflow').populate('createdBy.user').
                                        populate('editedBy.user').
                                        exec(function (error, _res) {
                                            if (!error) {
                                                i++;
                                                res['data'] = res['data'].concat(_res1);
                                                res['data'] = res['data'].concat(_res);
                                                if (i == n) {
                                                    getOpportunities(res['data'], data);
                                                }
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

        opportunitie.aggregate(
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
                        result.forEach(function(_project) {
                            switch (_project._id) {
                                case "everyOne":
                                {
                                    qeryEveryOne(_project.ID, result.length);
                                }
                                    break;
                                case "owner":
                                {
                                    qeryOwner(_project.ID, result.length);
                                }
                                    break;
                                case "group":
                                {
                                    qeryByGroup(_project.ID, result.length);
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

        var getOpportunities = function(opportunitiesArray, data) {
            var opportunitiesArrayForSending = [];
            for (var k = (data.page - 1) * data.count; k <(data.page * data.count); k++) {
                if (k < opportunitiesArray.length) {
                    opportunitiesArrayForSending.push(opportunitiesArray[k]);
                }

            }
            res['listLength'] = opportunitiesArray.length;
            res['data'] = opportunitiesArrayForSending;
            response.send(res);
        }
    };

    function update(_id, data, res) {
        function updateOpp() {
            var createPersonCustomer = function (company) {
                if (data.contactName && (data.contactName.first || data.contactName.last)) {                           //�������� Person
                    var _person = {
                        name: data.contactName,
                        email: data.email,
                        company: company._id,
                        salesPurchases: {
                            isCustomer: true,
                            salesPerson: data.salesPerson
                        },
                        type: ''
                    }
                    customer.customer.find({ $and: [{ 'name.first': data.contactName.first }, { 'name.last': data.contactName.last }] }, function (err, _persons) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Opportunities.js update opportunitie.update " + err);
                        } else if (_persons.length > 0) {
                            if (_persons[0].salesPurchases && !_persons[0].salesPurchases.isCustomer) {
                                customer.customer({ _id: _persons[0]._id }, { $set: { 'salesPurchases.isCustomer': true } }, function (err, success) {
                                    if (err) {
                                        console.log(err);
                                        logWriter.log("Opportunities.js update opportunitie.update " + err);
                                    }
                                });
                            }
                        } else {
                            var _Person = new customer.customer(_person);
                            _Person.save(function (err, _res) {
                                if (err) {
                                    console.log(err);
                                    logWriter.log("Opportunities.js update opportunitie.update " + err);
                                }
                            });
                        }
                    });
                }                                              //����� �������� Person
            };

            if (data.company && data.company._id) {
                data.company = data.company._id;
            } else if (data.company) {
                data.tempCompanyField = data.company;
                delete data.company;
            } else {
                delete data.company;
            }
            if (data.customer && data.customer._id) {
                data.customer = data.customer._id;
            }
            if (data.salesPerson && data.salesPerson._id) {
                data.salesPerson = data.salesPerson._id;
            }
            if (data.salesTeam && data.salesTeam._id) {
                data.salesTeam = data.salesTeam._id;
            }
            if (data.workflow && data.workflow._id) {
                data.workflow = data.workflow._id;
            }

            opportunitie.update({ _id: _id }, data, function (err, result) {
                console.log(data);
                if (err) {
                    console.log(err);
                    logWriter.log("Opportunities.js update opportunitie.update " + err);
                    res.send(500, { error: "Can't update Opportunities" });
                } else {
                    if (data.createCustomer) {                       //�������� ���������
                        console.log('************Cre Cust***********');
                        console.log(data.tempCompanyField);
                        console.log('*******************************');
                        if (data.tempCompanyField) {                          //�������� �������
                            var _company = {
                                name: {
                                    first: data.tempCompanyField,
                                    last: ''
                                },
                                email: data.email,
                                salesPurchases: {
                                    isCustomer: true,
                                    salesPerson: data.salesPerson
                                },
                                type: 'Company'
                            };
                            console.log(_company);
                            customer.customer.find({ 'name.first': data.tempCompanyField }, function (err, companies) {
                                if (err) {
                                    console.log(err);
                                    logWriter.log("Opportunities.js update opportunitie.update " + err);
                                } else if (companies.length > 0) {
                                    if (companies[0].salesPurchases && !companies[0].salesPurchases.isCustomer) {
                                        customer.customer.update({ _id: companies[0]._id }, { $set: { 'salesPurchases.isCustomer': true } }, function (err, success) {
                                            if (success) {
                                                createPersonCustomer(companies[0]);
                                            }
                                        })
                                    }
                                } else {
                                    var _Company = new customer.customer(_company);
                                    _Company.save(function (err, _res) {
                                        if (err) {
                                            console.log(err);
                                            logWriter.log("Opportunities.js update opportunitie.update " + err);
                                        } else {
                                            opportunitie.update({ _id: _id }, { $set: { company: _res._id, customer: _res._id } }, function (err, result) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                            createPersonCustomer(_res);
                                        }
                                    });
                                }
                            });

                        } else {                                              //кінець кастомер Компанія
                            createPersonCustomer({});
                        }
                    }
                    res.send(200, { success: 'Opportunities updated success' });
                }
            });
        };

        try {
            delete data._id;
            delete data.createdBy;
            if (data.workflow && data.workflow.wId == 'Lead') {
                workflow.workflow.findOne({ wId: 'Opportunity' }, function(err, _workflow) {
                    if (_workflow) {
                        data.workflow._id = _workflow._id;
                    }
                    updateOpp();
                });
            } else {
                updateOpp();
            }
            
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Opportunities.js update " + exception);
            res.send(500, { error: 'Opportunities updated error' });
        }
    };// end update

    function getFilterOpportunities(data, response) {
        var res = {};
        res['data'] = [];
        var query = opportunitie.find();
        query.where('isOpportunitie', true);
		if (data && data.status && data.status.length>0)
            query.where('workflow').in(data.status);

        query.exec(function (err, result) {
            if (!err) {
                res['listLength'] = result.length;
            }
        });
        var query = opportunitie.find();
        query.where('isOpportunitie', true);
		if (data && data.status && data.status.length>0)
            query.where('workflow').in(data.status);

        query.populate('relatedUser customer department jobPosition workflow').
            populate('createdBy.user').
            populate('editedBy.user');

        query.skip((data.page - 1) * data.count).limit(data.count);
        query.sort({ 'name.first': 1 });
        query.exec(function (err, opportunities) {
            if (err) {
                console.log(err);
                logWriter.log('Opportunities.js get Opportunities.find' + err);
                response.send(500, { error: "Can't find Opportunities" });
            } else {
                res['data'] = opportunities;
                response.send(res);
            }
        });
    };

    function getFilterOpportunitiesForKanban(data, response) {
        var res = {};
        res['data'] = [];
        res['showMore'] = [];
        res['options'] = [];
        var optionsArray = [];
        var showMore = false;

        var queryAggregate = opportunitie.aggregate({ $match: { isOpportunitie: true } }, { $group: { _id: "$workflow", opportunitieId: { $push: "$_id" } } })
        queryAggregate.exec(
            function (err, responseOpportunitie) {
                if (!err) {

                    var responseOpportunitieArray = [];
                    var columnValue = data.count;
                    var page = data.page;

                    responseOpportunitie.forEach(function (value) {
                        value.opportunitieId.forEach(function (idOpportunitie, opportunitieIndex) {
                            if (((page - 1) * columnValue <= opportunitieIndex) && (opportunitieIndex < (page - 1) * columnValue + columnValue)) {
                                responseOpportunitieArray.push(idOpportunitie);
                            }
                        });
                        var myObj = {
                            id: value._id,
                            namberOfOpportunitie: value.opportunitieId.length,
                            remainingOfOpportunitie: value.remaining
                        };
                        optionsArray.push(myObj);
                        if (value.opportunitieId.length > ((page - 1) * columnValue + columnValue)) {
                            showMore = true;
                        }
                    });
                    opportunitie.find()
                        .where('_id').in(responseOpportunitieArray)
                        .populate('relatedUser customer department jobPosition workflow')
                        .populate('createdBy.user')
                        .populate('editedBy.user')
                        .exec(function (err, resalt) {
                            if (!err) {
                                res['showMore'] = showMore;
                                res['options'] = optionsArray;
                                res['data'] = resalt;
                                response.send(res);
                            } else {
                                logWriter.log("Opportunitie.js getFilterOpportunitiesForKanban opportunitie.find " + err);
                                response.send(500, { error: "Can't find Opportunitie" });
                            }
                        })
                } else {
                    logWriter.log("Opportunitie.js getFilterOpportunitiesForKanban opportunitie.find " + err);
                    response.send(500, { error: "Can't group Opportunitie" });
                }
            });


    };

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

        getById: getById,

        getFilterOpportunities: getFilterOpportunities,

        getFilterOpportunitiesForKanban: getFilterOpportunitiesForKanban,

        getLeads: getLeads,

        getLeadsCustom: getLeadsCustom,

        update: update,

        remove: remove
    }
};
module.exports = Opportunities;
